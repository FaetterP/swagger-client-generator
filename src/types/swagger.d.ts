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

export type Ref = {
  $ref: string;
};

export type SuccessResponse = {
  type: "object";
  properties: {
    status: {
      type: "string";
      example: "ok";
    };
    data: Ref | Schema;
  };
};

export type Swagger = {
  openapi: string;
  paths: {
    [url: string]: {
      [method: string]: {
        operationId: string;
        parameters: {
          name: string;
          required: boolean;
          in: "query" | "path";
          schema: {
            type: "number" | "string";
          };
        }[];
        requestBody?: {
          required: true;
          content: {
            "application/json": {
              schema: Ref | Schema;
            };
          };
        };
        responses: {
          [status: string]: {
            description: string;
            content?: {
              "application/json": {
                schema: SuccessResponse | Schema | Ref;
              };
            };
          };
        };
        tags: string[];
      };
    };
  };
  info: {
    title: string;
    description: string;
    version: string;
    contact: {};
  };
  components: {
    schemas: {
      [schema: string]: Schema;
    };
  };
};
