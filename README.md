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
  ├─ services
      └─ {tag}.ts // Class here
  ├─ types
      └─ schemes.ts // Schemes from $ref
  └─ utils
package.json
README.md
tsconfig.json
```

Service view.

```ts
export class UsersService {
  private serviceUrl: string;
  private httpClient: AxiosInstance;

  constructor(serviceUrl: string) {
    this.serviceUrl = serviceUrl;
    this.httpClient = getHttpClient(this.serviceUrl);
  }

  async create(body: CreateUserDTO): Promise<UserDTO> {
    const response = await this.httpClient.post<AnyResponse<UserDTO>>("/drivers", body);
    return extractSuccessResponse(response.data);
  }

  // ...
}
```

Function `extractSuccessResponse(obj)` used for unpack responses of type `{status:"ok", data:any} | {status:"error", message:string}`.  
If status is ok then return `obj.data`.  
If status is error then throw `obj.error`.
  
If response of other type then extractSuccessResponse don't generated.

## Using

```ts
import { UserService, UserDTO, CreateUserDTO } from "path/or/packageName"

const userService = new UserService("baseUrl");
const data:CreateUserDTO = {/**/};
const user:UserDTO = await userService.create(data);
```
