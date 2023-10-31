export type Schema =
  | {
      type: "string" | "number" | "integer" | "boolean";
    }
  | {
      type: "object";
      properties: {
        [field: string]: Schema;
      };
      required?: string[];
    }
  | {
      type: "array";
      items: Schema;
    };
