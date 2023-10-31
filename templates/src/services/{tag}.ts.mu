import path from 'node:path';
import axios from 'axios';
import { Config } from '../utils/config';
import { {{#schemes}}{{.}}, {{/schemes}}} from '../types/schemes';
import { getHttpClient } from '../utils/httpClient';
import { AnyResponse, extractSuccessResponse } from '../utils/responses';

const clientConfigPath = 'config.toml';
const clientFullConfigPath = path.resolve(__dirname, clientConfigPath); // TODO change with env
Config.load(clientFullConfigPath);

export class {{className}}Service {
  private serviceUrl: string;
  private httpClient: axios.AxiosInstance;

  constructor(serviceUrl?: string) {
    this.serviceUrl = serviceUrl ?? Config.get('service').url;
    this.httpClient = getHttpClient(this.serviceUrl);
  }

  {{#endpoints}}
  async {{functionName}}({{#isId}}id: string, {{/isId}}{{#bodyType}}body: {{bodyType}},{{/bodyType}}{{#queryType}}query: {{queryType}},{{/queryType}}): Promise<{{returnedType}}> {
    const endpoint = Config.get('endpoints.{{tagName}}.{{functionName}}');
    const response = await this.httpClient.{{method}}<AnyResponse<{{returnedType}}>>(endpoint{{#isId}}.replace("/{id}", `/${id}`){{/isId}}, {{#bodyType}}body, {{/bodyType}}{{#queryType}}{ params: query }{{/queryType}});
    return extractSuccessResponse(response.data);
  }

  {{/endpoints}}
}
