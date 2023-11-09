import { AxiosInstance } from 'axios';{{#isUsedSchemes}}
import { {{#schemes}}{{.}}, {{/schemes}}} from '../types/schemes';{{/isUsedSchemes}}
import { getHttpClient } from '../utils/httpClient';
import { AnyResponse, extractSuccessResponse, extractError } from '../utils/responses';

export class {{className}}Service {
  private serviceUrl: string;
  private httpClient: AxiosInstance;

  constructor(serviceUrl: string) {
    this.serviceUrl = serviceUrl;
    this.httpClient = getHttpClient(this.serviceUrl);
  }

  {{#endpoints}}
  async {{functionName}}({{#isId}}id: string, {{/isId}}{{#bodyType}}body: {{bodyType}},{{/bodyType}}{{#queryType}}query: {{queryType}},{{/queryType}}): Promise<{{#returnedType}}{{returnedType}}{{/returnedType}}{{^returnedType}}void{{/returnedType}}> {
    try{
      const response = await this.httpClient.{{method}}<{{#isNeedExtract}}AnyResponse<{{#returnedType}}{{returnedType}}{{/returnedType}}{{^returnedType}}void{{/returnedType}}>{{/isNeedExtract}}{{^isNeedExtract}}{{#returnedType}}{{returnedType}}{{/returnedType}}{{^returnedType}}void{{/returnedType}}{{/isNeedExtract}}>("{{{url}}}"{{#isId}}.replace("/{id}", `/${id}`){{/isId}}, {{#bodyType}}body, {{/bodyType}}{{#queryType}}{ params: query }{{/queryType}});
      return {{#isNeedExtract}}extractSuccessResponse(response.data);{{/isNeedExtract}}{{^isNeedExtract}}response.data{{/isNeedExtract}}
    } catch(error){
      return extractError(error);
    }
  }

  {{/endpoints}}
}
