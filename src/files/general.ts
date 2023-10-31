import { globSync } from "glob";
import path from "node:path";
import fs from "fs";
import Mustache from "mustache";
import { FileConfig, GeneratorConfig } from "../types/generator";

function getMustaches() {
  const pathToTemplates = path.join(__dirname, "..", "..", "templates");
  return globSync(pathToTemplates + "/**/*.mustache");
}

function getMus() {
  const pathToTemplates = path.join(__dirname, "..", "..", "templates");
  return globSync(pathToTemplates + "/**/*.mu");
}

export function generate(config: GeneratorConfig, fileConfig: FileConfig) {
  generateMustaches(config, fileConfig);
  generateMus(config, fileConfig);
}

function generateMustaches(config: GeneratorConfig, fileConfig: FileConfig) {
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

function generateMus(config: GeneratorConfig, fileConfig: FileConfig) {
  for (const file of getMus()) {
    for (const tag of config.tags) {
      const content = fs.readFileSync(file, "utf-8");
      const savePath = file
        .substring(0, file.length - ".mu".length)
        .replace("templates", "output")
        .replace("{tag}", tag.tagName);

      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, Mustache.render(content, tag));

      console.log(`File saved: ${savePath}`);
    }
  }
}
