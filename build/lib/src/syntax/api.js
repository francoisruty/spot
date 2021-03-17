"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
/**
 * Class decorator factory for describing an API.
 *
 * ```ts
 * @api({ name: "Company API" })
 * class CompanyApi {}
 * ```
 *
 * @param config configuration
 */
function api(config) {
    return (target) => { };
}
exports.api = api;
