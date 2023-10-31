import { GeneratorConfig } from "../types/generator";
import { Ref, Schema, SuccessResponse, Swagger } from "../types/swagger";
import { camelize, capitalize } from "./string";

export function extractConfig(swagger: Swagger): GeneratorConfig {
  const schemes: GeneratorConfig["schemes"] = [];
  for (const [schemeName, scheme] of Object.entries(
    swagger.components.schemas
  )) {
    schemes.push({ name: schemeName, type: convertSchemeToType(scheme) });
  }

  const tags: GeneratorConfig["tags"] = [];
  const allTags = getAllTags(swagger);

  for (const tagName of allTags) {
    const endpoints: GeneratorConfig["tags"][0]["endpoints"] = [];
    const tagSchemes = new Set<string>();

    for (const [url, t] of Object.entries(swagger.paths)) {
      for (const [method, data] of Object.entries(t)) {
        if (!data.tags.includes(tagName)) continue;

        const schemes = getSchemes(swagger, url, method);
        for (const scheme of schemes) {
          tagSchemes.add(scheme);
        }

        const endpoint: (typeof endpoints)[0] = {
          functionName: data.operationId,
          url,
          method,
          isId: IsId(swagger, url, method),
          bodyType: convertRequestBodyToType(swagger, url, method),
          queryType: convertQueryToType(swagger, url, method),
          returnedType: convertReturnedType(swagger, url, method),
        };
        endpoints.push(endpoint);
      }
    }

    const added: GeneratorConfig["tags"][0] = {
      tagName: camelize(tagName),
      className: capitalize(camelize(tagName)),
      schemes: [...tagSchemes],
      endpoints,
    };
    tags.push(added);
  }

  const config: GeneratorConfig = { schemes, tags };
  return config;
}

export function getAllTags(swagger: Swagger): string[] {
  const result = new Set<string>();

  for (const [url, t] of Object.entries(swagger.paths)) {
    for (const [method, data] of Object.entries(t)) {
      for (const tag of data.tags) {
        result.add(tag);
      }
    }
  }

  return [...result];
}

export function convertSchemeToType(schema: Schema): string {
  switch (schema.type) {
    case "object":
      let fieldsAndTypes: string[] = [];
      for (const [field, data] of Object.entries(schema.properties)) {
        const isRequired = schema.required && schema.required.includes(field);

        fieldsAndTypes.push(
          `${field}${isRequired ? "" : "?"}: ${convertSchemeToType(data)}`
        );
      }
      return `{${fieldsAndTypes.reduce((a, b) => `${a}, ${b}`)}}`;
    case "array":
      const itemsType = convertSchemeToType(schema.items);
      return `${itemsType}[]`;
    default:
      return schema.type;
  }
}

export function convertQueryToType(
  swagger: Swagger,
  url: string,
  method: string
): string | undefined {
  const queries = swagger.paths[url][method].parameters.filter(
    (par) => par.in === "query"
  );

  if (queries.length === 0) return undefined;

  return `{${queries.reduce(
    (a, b) => `${a}${b.name}${b.required ? ":" : "?:"}${b.schema.type},`,
    ""
  )}}`;
}

export function convertRequestBodyToType(
  swagger: Swagger,
  url: string,
  method: string
): string | undefined {
  const requestBody = swagger.paths[url][method].requestBody;

  if (!requestBody) return undefined;

  const ref = (requestBody.content["application/json"].schema as Ref).$ref;
  if (ref) {
    return ref.split("/").at(-1);
  }

  const schema = requestBody.content["application/json"].schema as Schema;
  return convertSchemeToType(schema);
}

export function IsId(
  swagger: Swagger,
  url: string,
  method: string
): true | undefined {
  const data = swagger.paths[url][method];
  return data.parameters.filter((par) => par.in === "path" && par.name === "id")
    .length > 0
    ? true
    : undefined;
}

export function convertReturnedType(
  swagger: Swagger,
  url: string,
  method: string
): string | undefined {
  const data = swagger.paths[url][method];
  if (Object.keys(data.responses).length === 0) return "unknown";

  const statuses = [200, 201];
  for (const status of statuses) {
    const content = data.responses[status]?.content;
    if (!content) continue;

    const scheme = content["application/json"].schema;

    const ref = (scheme as Ref).$ref;
    if (ref) {
      return getNameFromRef(ref);
    }

    const successData = (scheme as SuccessResponse).properties.data;
    const successRef = (successData as Ref).$ref;
    if (successRef) {
      return getNameFromRef(successRef);
    }

    return convertSchemeToType(successData as Schema);
  }
}

export function getSchemes(
  swagger: Swagger,
  url: string,
  method: string
): string[] {
  const result: string[] = [];
  const data = swagger.paths[url][method];

  const body = data.requestBody?.content["application/json"].schema;
  if (body) {
    const bodyRef = (body as Ref).$ref;
    if (bodyRef) {
      result.push(getNameFromRef(bodyRef));
    }
  }

  const statuses = [200, 201];
  for (const status of statuses) {
    const content = data.responses[status]?.content;
    if (!content) continue;

    const ref = (content["application/json"].schema as Ref).$ref;
    if (ref) {
      result.push(getNameFromRef(ref));
    }

    const responseData = (content["application/json"].schema as SuccessResponse)
      .properties.data;
    const responseRef = (responseData as Ref).$ref;
    if (responseRef) {
      result.push(getNameFromRef(responseRef));
    }
  }

  return result;
}

export function getNameFromRef(ref: string): string {
  return ref.split("/").at(-1)!;
}
