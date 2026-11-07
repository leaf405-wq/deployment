export type MinuteClock = {
  key: string;
  thenKey: string;
  label: string;
  compared: string;
  elapsed: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function minuteClock(date: Date): MinuteClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const bag = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const hour = bag.hour === "24" ? "00" : bag.hour;
  const year = Number(bag.year);
  const month = Number(bag.month);
  const day = Number(bag.day);
  const hourNumber = Number(hour);
  const minute = Number(bag.minute);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevDay = Math.min(day, new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate());
  return {
    key: `${bag.year}${bag.month}${pad(day)}${hour}${bag.minute}`,
    thenKey: `${prevYear}${pad(prevMonth)}${pad(prevDay)}${hour}${bag.minute}`,
    label: `${bag.year}.${bag.month}.${pad(day)} ${hour}:${bag.minute}`,
    compared: `${prevYear}.${pad(prevMonth)}.${pad(prevDay)} ${pad(hourNumber)}:${pad(minute)}`,
    elapsed: date.getUTCSeconds() + date.getUTCMilliseconds() / 1000,
  };
}
