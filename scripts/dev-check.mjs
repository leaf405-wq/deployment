import { existsSync } from "node:fs";

const here = process.cwd();
const ready =
  existsSync("package.json") &&
  existsSync("next.config.ts") &&
  existsSync("src/app/globals.css") &&
  existsSync("src/app/shadcn-theme.css");

if (!ready) {
  console.error(`当前目录不是之之风速：${here}`);
  console.error("请进入解压或克隆出来的文件夹，确认这里能看到 package.json，再运行 npm run dev。");
  process.exit(1);
}

if (!existsSync("node_modules/next")) {
  console.error("还没有安装依赖。在这个目录里先运行 npm install。");
  process.exit(1);
}
