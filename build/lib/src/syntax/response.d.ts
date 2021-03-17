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
export declare function response(config: ResponseConfig): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
export interface ResponseConfig {
    /** HTTP status code */
    status: number;
}
