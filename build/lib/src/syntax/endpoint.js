"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoint = void 0;
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
function endpoint(config) {
    return (target) => { };
}
exports.endpoint = endpoint;
