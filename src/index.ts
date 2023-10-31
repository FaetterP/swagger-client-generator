import { Swagger } from "./types/swagger";
import { extractConfig } from "./utils/swagger";
import fs from "fs";

const swagger = JSON.parse(
  fs.readFileSync("./swagger.json", "utf-8")
) as Swagger;

(() => {
  const config = extractConfig(swagger);
  console.log(config.tags.map((el) => el.endpoints));
})();
