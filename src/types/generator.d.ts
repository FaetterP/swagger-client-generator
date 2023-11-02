export type GeneratorConfig = {
  schemes: { name: string; type: string }[];

  tags: {
    tagName: string;
    className: string;

    isUsedSchemes: boolean;
    schemes: string[];

    endpoints: {
      functionName: string;
      url: string;
      method: string;
      queryType?: string;
      bodyType?: string;
      isId?: boolean;
      returnedType?: string;
      isNeedExtract: boolean;
    }[];
  }[];
};

export type FileConfig = {
  packageName: string;
  packageVersion: string;
  mainEntityName: string;
  
  isUseTsup: boolean;
  swaggerPath?: string;
};
