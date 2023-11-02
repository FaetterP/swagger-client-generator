import { generate } from "./files/general";
import { FileConfig } from "./types/generator";
import { Swagger } from "./types/swagger";
import { extractConfig } from "./utils/swagger";
import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";
import { isUrl } from "./utils/string";
import { rimrafSync } from "rimraf";
import { generateTsupConfig } from "./files/tsupConfig";

(async () => {
  rimrafSync("./output");

  const fileConfig = JSON.parse(
    fs.readFileSync("./config.json", "utf-8"),
  ) as FileConfig;

  let swagger;
  if (fileConfig.swaggerPath && isUrl(fileConfig.swaggerPath)) {
    swagger = await fetch(fileConfig.swaggerPath);
    swagger = await swagger.json();
  } else {
    swagger = JSON.parse(
      fs.readFileSync(fileConfig.swaggerPath || "./swagger.json", "utf-8"),
    );
  }
  swagger = swagger as Swagger;

  const config = extractConfig(swagger);

  generate(config, fileConfig);
  if (fileConfig.isUseTsup) {
    generateTsupConfig();
  }
  console.log("Success");

  exec("npm run format", (err) => {
    console.log(err || "Formatting finished");
  });
})();
