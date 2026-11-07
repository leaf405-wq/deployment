import { toast } from "sonner";

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast("已抄进剪贴板", { description: "发出去之前，改成顾问自己的句子。" });
  } catch {
    toast.error("没有抄下来", {
      description: "浏览器拦住了剪贴板，可以手动选择正文。",
    });
  }
}
