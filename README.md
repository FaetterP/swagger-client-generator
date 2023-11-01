# Swagger Client Generator

Generate functions wrapping endpoints from swagger.  
Final result using `typescript`.

## Preparing

Fill `./config.json`. This file contains settings for generation.

```js
{
  packageName: "someName", // Package name and version used in package.json
  packageVersion: "0.0.1",
  mainEntityName: "Users", // Used in readme
  isUseTsup: false, // Build using tsup (true) or tsc (false)

  port: 3000, // Server dev port

  swaggerPath?: "" // Path fo swagger.json. Or you can provide url to fetch swagger from it
}
```

Put `./swagger.json` in root of repository, near README.md.

## Run

```sh
npm run start
```

Output:

```txt
File saved: output\tsconfig.json
File saved: output\README.md
File saved: output\package.json
File saved: output\config.toml
File saved: output\src\index.ts
File saved: output\src\utils\responses.ts
File saved: output\src\utils\httpClient.ts
File saved: output\src\utils\config.ts
File saved: output\src\types\schemes.ts
File saved: output\src\services\general.ts
Success
Formatting finished
```

## Output

Your client will be in `./output` folder.

```ts
src
  + services
    + {tag}.ts // Function here
  + types
    + schemes.ts // Schemes from $ref
  + utils
config.toml // Config with endpoints urls
package.json
README.md
tsconfig.json
```

Service view.

```ts
export class UsersService {
  private serviceUrl: string;
  private httpClient: AxiosInstance;

  constructor(serviceUrl?: string) {
    this.serviceUrl = serviceUrl ?? Config.get("service").url;
    this.httpClient = getHttpClient(this.serviceUrl);
  }

  async create(body: CreateUserDTO): Promise<UserDTO> {
    const endpoint = Config.get("endpoints.drivers.create");
    const response = await this.httpClient.post<AnyResponse<UserDTO>>(endpoint,body);
    return extractSuccessResponse(response.data);
  }

  // ...
}
```
