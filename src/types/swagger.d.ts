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
              schema:
                | {
                    $ref: string;
                  }
                | Schema;
            };
          };
        };
        responses: {
          [status: string]: {
            description: string;
            content: {
              "application/json": {
                schema:
                  | {
                      type: "object";
                      properties: {
                        status: {
                          type: "string";
                          example: "ok";
                        };
                        data:
                          | {
                              $ref: "#/components/schemas/DriverDTO";
                            }
                          | Schema;
                      };
                    }
                  | Schema;
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
