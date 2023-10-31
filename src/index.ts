import { generate } from "./files/general";
import { FileConfig } from "./types/generator";
import { Swagger } from "./types/swagger";
import { extractConfig } from "./utils/swagger";
import fs from "fs";
import { exec } from "child_process";

(() => {
  const swagger = JSON.parse(
    fs.readFileSync("./swagger.json", "utf-8")
  ) as Swagger;

  const fileConfig = JSON.parse(
    fs.readFileSync("./config.json", "utf-8")
  ) as FileConfig;

  const config = extractConfig(swagger);

  generate(config, fileConfig);
  console.log("Success");

  exec("npm run format", (err) => {
    console.log(err || "Formatting finished");
  });
})();
