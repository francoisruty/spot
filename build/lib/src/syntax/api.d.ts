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
export declare function api(config: ApiConfig): (target: any) => void;
export interface ApiConfig {
    /** Name of the API. This should be the name of the service that is being documented */
    name: string;
    /** Version of this document */
    version?: string;
}
