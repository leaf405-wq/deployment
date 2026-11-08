"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type Persisted = {
  contacted: Record<string, string>;
  adopted: string[];
  invited: Record<string, string[]>;
};

const empty: Persisted = { contacted: {}, adopted: [], invited: {} };
const KEY = "zhizhi-desk-v1";
const EVENT = "zhizhi-desk-change";

function parse(raw: string): Persisted {
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      contacted: parsed.contacted && typeof parsed.contacted === "object" ? parsed.contacted : {},
      adopted: Array.isArray(parsed.adopted)
        ? parsed.adopted.filter((item): item is string => typeof item === "string")
        : [],
      invited: parsed.invited && typeof parsed.invited === "object" ? parsed.invited : {},
    };
  } catch {
    return empty;
  }
}

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

function snapshot() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function write(next: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 隐私模式或配额不足时，这一次操作只留在内存里的下一次点击之前。
  }
  window.dispatchEvent(new Event(EVENT));
}

type DeskContextValue = Persisted & {
  adopt: (id: string) => void;
  toggleContact: (id: string) => void;
  toggleInvite: (salonId: string, clientId: string, seats: number | null, held: number) => void;
};

const DeskContext = createContext<DeskContextValue | null>(null);

export function DeskProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const state = useMemo(() => parse(raw), [raw]);

  const adopt = useCallback((id: string) => {
    const current = parse(snapshot());
    if (current.adopted.includes(id)) return;
    write({ ...current, adopted: [...current.adopted, id] });
  }, []);

  const toggleContact = useCallback((id: string) => {
    const current = parse(snapshot());
    const contacted = { ...current.contacted };
    if (contacted[id]) delete contacted[id];
    else contacted[id] = new Date().toISOString();
    write({ ...current, contacted });
  }, []);

  const toggleInvite = useCallback(
    (salonId: string, clientId: string, seats: number | null, held: number) => {
      const current = parse(snapshot());
      const list = current.invited[salonId] ?? [];
      const has = list.includes(clientId);
      if (!has && seats !== null && held + list.length >= seats) return;
      const next = has ? list.filter((item) => item !== clientId) : [...list, clientId];
      write({ ...current, invited: { ...current.invited, [salonId]: next } });
    },
    [],
  );

  const value = useMemo(
    () => ({ ...state, adopt, toggleContact, toggleInvite }),
    [adopt, state, toggleContact, toggleInvite],
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const value = useContext(DeskContext);
  if (!value) throw new Error("运营台尚未就绪");
  return value;
}
