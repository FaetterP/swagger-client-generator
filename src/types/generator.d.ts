export type GeneratorConfig = {
  schemes: { name: string; type: string }[];

  tags: {
    tagName: string;
    className: string;

    schemes: string[];

    endpoints: {
      functionName: string;
      url: string;
      method: string;
      queryType?: string;
      bodyType?: string;
      isId?: boolean;
      returnedType?: string;
    }[];
  }[];
};
