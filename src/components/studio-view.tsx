"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copyText } from "@/components/copy-text";
import { composeCopy, type Channel, type Tone } from "@/lib/engine";
import { brandCode, products, type Product } from "@/lib/maison";

const channels: { id: Channel; label: string }[] = [
  { id: "xiaohongshu", label: "小红书" },
  { id: "wechat", label: "微信" },
  { id: "invitation", label: "请柬" },
  { id: "voice", label: "口播" },
];

const tones: { id: Tone; label: string }[] = [
  { id: "restrained", label: "克制" },
  { id: "heritage", label: "传承" },
  { id: "season", label: "当季" },
];

export function StudioView() {
  const [product, setProduct] = useState<Product | null>(null);
  const [channel, setChannel] = useState<Channel>("xiaohongshu");
  const [tone, setTone] = useState<Tone>("restrained");
  const [occasion, setOccasion] = useState("");
  const [seed, setSeed] = useState(0);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<ReturnType<typeof composeCopy> | null>(null);
  const [caption, setCaption] = useState("");

  const tooLong = occasion.trim().length > 40;
  const channelLabel = channels.find((item) => item.id === channel)?.label;
  const toneLabel = tones.find((item) => item.id === tone)?.label;
  const currentCaption = product ? `${product.name} · ${channelLabel} · ${toneLabel}` : "";
  const stale = Boolean(draft && caption && caption !== currentCaption);

  function write(nextSeed: number) {
    if (!product || tooLong) return;
    setPending(true);
    window.setTimeout(() => {
      setDraft(composeCopy({ product, channel, tone, occasion, seed: nextSeed }));
      setCaption(`${product.name} · ${channelLabel} · ${toneLabel}`);
      setSeed(nextSeed);
      setPending(false);
    }, 280);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">内容工坊 · 品牌法典</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">只改语气，不改事实</h1>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" className="h-10 rounded-none px-4" />}>
            查看法典
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">模型被允许做的事</DialogTitle>
              <DialogDescription>这些边界写在生成之前，不写在生成之后。</DialogDescription>
            </DialogHeader>
            <ul className="space-y-2 text-sm leading-6">
              {brandCode.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        小红书负责让人想看见，微信负责对一个具体的人说话。价格、促销词和别人的私事进不了公开正文。
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">单品档案</p>
          <div className="mt-3 divide-y divide-[#d9d1c3] border-y border-[#d9d1c3]">
            {products.map((item) => {
              const selected = product?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProduct(item)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "flex w-full items-baseline justify-between gap-3 bg-[#ebe4d6] px-3 py-2.5 text-left"
                      : "flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left hover:bg-[#ebe4d6]/50"
                  }
                >
                  <span className="font-serif text-lg">{item.name}</span>
                  <span className="shrink-0 text-xs text-[#6d645b]">{item.family}</span>
                </button>
              );
            })}
          </div>

          <fieldset className="mt-6">
            <legend className="text-[11px] tracking-[0.16em] text-[#6d645b]">渠道</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {channels.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={channel === item.id ? "default" : "outline"}
                  className="h-9 rounded-none px-3"
                  onClick={() => setChannel(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-[11px] tracking-[0.16em] text-[#6d645b]">语气</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {tones.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={tone === item.id ? "default" : "outline"}
                  className="h-9 rounded-none px-3"
                  onClick={() => setTone(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-[11px] tracking-[0.16em] text-[#6d645b]" htmlFor="occasion">
            场合，可空
          </label>
          <Input
            id="occasion"
            value={occasion}
            onChange={(event) => setOccasion(event.target.value)}
            placeholder="例如：配偶生日，只要白天"
            aria-invalid={tooLong}
            className="mt-3 h-10 rounded-none bg-transparent"
          />
          {tooLong ? (
            <p role="alert" className="mt-2 text-sm text-[#8c3a32]">
              补充太长。留一个场合就够，不要把简报贴进来。
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-[#6d645b]">
              私人场合只会进入微信和请柬。小红书与口播会把它留下。
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button className="h-10 rounded-none px-4" disabled={!product || tooLong || pending} onClick={() => write(seed)}>
              {product ? "写成一版" : "先选一件单品"}
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-none px-4"
              disabled={!draft || pending || tooLong}
              onClick={() => write(seed + 1)}
            >
              再写一版
            </Button>
          </div>

          {product ? (
            <div className="mt-6 border-t border-[#d9d1c3] pt-4 text-sm leading-7 text-[#3c342c]">
              <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">允许引用</p>
              <p className="mt-2">{product.material}。</p>
              <p>{product.craft}。</p>
              <p>{product.story}。</p>
            </div>
          ) : null}
        </div>

        <div
          className="min-h-[24rem] border border-[#d9d1c3] bg-[#f7f4ee] p-5 md:p-7 lg:sticky lg:top-8"
          aria-live="polite"
        >
          {pending ? (
            <p className="text-sm leading-7 text-[#6d645b]">正在按档案写，不另编工艺。</p>
          ) : draft ? (
            <div>
              <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">{caption}</p>
              {stale ? <p className="mt-2 text-xs text-[#8c734b]">条件已改。这一版还是上一组条件。</p> : null}
              <div className="mt-5 space-y-8">
                {draft.variants.map((variant) => (
                  <article key={variant.label}>
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-display text-2xl italic">{variant.label}</h2>
                      <Button
                        variant="outline"
                        className="h-8 rounded-none px-3"
                        onClick={() => copyText([variant.title, variant.body].filter(Boolean).join("\n\n"))}
                      >
                        抄下
                      </Button>
                    </div>
                    {variant.title ? (
                      <h3 className="mt-3 font-serif text-2xl leading-snug font-medium">{variant.title}</h3>
                    ) : null}
                    <p className="mt-3 font-serif text-[16px] leading-8 whitespace-pre-wrap">{variant.body}</p>
                  </article>
                ))}
              </div>
              <ul className="mt-8 space-y-1 border-t border-[#d9d1c3] pt-4 text-xs leading-5 text-[#6d645b]">
                {draft.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex min-h-64 flex-col justify-center">
              <p className="font-serif text-2xl leading-snug">先选一件东西。</p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[#6d645b]">
                模型不从空白里想象材质。没有档案的句子，就不会出现在正文里。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
