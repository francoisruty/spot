import { HttpMethod } from "../definitions";
/**
 * Endpoint decorator factory for describing an API.
 *
 * @param config configuration
 * @example
```
@endpoint({
  method: "POST",
  path: "/users",
  tags: ["User"]
})
class CreateUserEndpoint {
  // ...
}
```
 */
export declare function endpoint(config: EndpointConfig): (target: any) => void;
export interface EndpointConfig {
    /** HTTP method */
    method: HttpMethod;
    /** URL path */
    path: string;
    /** Endpoint grouping tags */
    tags?: string[];
}
