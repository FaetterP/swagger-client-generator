import path from "node:path";
import fs from "fs";

export function generateTsupConfig() {
  const content = fs.readFileSync("./templates/tsup.config.ts.mst", "utf-8");

  const savePath = "./output/tsup.config.ts";
  fs.mkdirSync(path.dirname(savePath), { recursive: true });
  fs.writeFileSync(savePath, content);

  console.log(`File saved: ${savePath}`);
}
