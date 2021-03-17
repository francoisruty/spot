"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
/**
 * Decorator for describing a response. This should be used within an `@endpoint` decorated class.
 *
 * @example
```
@endpoint({
  // ...
})
class CreateUserEndpoint {
  // ...
  @response({ status: 201 })
  successResponse(
    // ...
  ) {}
  // ...
}
```
 */
function response(config) {
    return (target, propertyKey, descriptor) => { };
}
exports.response = response;
