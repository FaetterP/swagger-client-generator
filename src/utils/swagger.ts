import { Schema, Swagger } from "../types/swagger";

export function convertSchema(schema: Schema): string {
  switch (schema.type) {
    case "object":
      let fieldsAndTypes: string[] = [];
      for (const [field, data] of Object.entries(schema.properties)) {
        const isRequired = schema.required && schema.required.includes(field);

        fieldsAndTypes.push(
          `${field}${isRequired ? "" : "?"}: ${convertSchema(data)}`
        );
      }
      return `{${fieldsAndTypes.reduce((a, b) => `${a}, ${b}`)}}`;
    case "array":
      const itemsType = convertSchema(schema.items);
      return `${itemsType}[]`;
    default:
      return schema.type;
  }
}

export function convertQuery(
  swagger: Swagger,
  url: string,
  method: string
): string {
  const queries = swagger.paths[url][method].parameters.filter(
    (par) => par.in === "query"
  );
  return `{${queries.reduce(
    (a, b) => `${a}${b.name}${b.required ? "!" : ""}:${b.schema.type}`,
    ""
  )}}`;
}
