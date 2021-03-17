"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
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
function config(config) {
    return (target) => { };
}
exports.config = config;
