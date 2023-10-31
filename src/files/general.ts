import { globSync } from "glob";
import path from "node:path";
import fs from "fs";
import Mustache from "mustache";
import { FileConfig, GeneratorConfig } from "../types/generator";

function getMustaches() {
  const pathToTemplates = path.join(__dirname, "..", "..", "templates");
  return globSync(pathToTemplates + "/**/*.mustache");
}

export function generate(config: GeneratorConfig, fileConfig: FileConfig) {
  for (const file of getMustaches()) {
    const content = fs.readFileSync(file, "utf-8");
    const savePath = file
      .substring(0, file.length - ".mustache".length)
      .replace("templates", "output");

    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(
      savePath,
      Mustache.render(content, { ...config, ...fileConfig })
    );

    console.log(`File saved: ${savePath}`);
  }
}
