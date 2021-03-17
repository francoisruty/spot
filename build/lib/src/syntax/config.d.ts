import { QueryParamArrayStrategy } from "../definitions";
/**
 * Class decorator factory for describing a configuration.
 * Should be used in conjunction with @api.
 *
 * @param config configuration
 * @example
```
@api({ name: "Company API" })
@config({
  paramSerializationStrategy: {
    query: {
      array: "comma"
    }
  }
})
class CompanyApi {}
```
 */
export declare function config(config: ConfigConfig): (target: any) => void;
export interface ConfigConfig {
    /** The global configuration for parameter serialization strategy */
    paramSerializationStrategy: ParamSerializationStrategy;
}
interface ParamSerializationStrategy {
    query?: QueryParamSerializationStrategy;
}
interface QueryParamSerializationStrategy {
    array?: QueryParamArrayStrategy;
}
export {};
