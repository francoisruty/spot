import { Contract } from "../../definitions";
import { Violation } from "../spots/validate";
import { UserInputRequest, UserInputResponse } from "./user-input-models";
export declare class ContractMismatcher {
    private readonly contract;
    private typeTable;
    constructor(contract: Contract);
    findViolations(userInputRequest: UserInputRequest, userInputResponse: UserInputResponse): {
        violations: Violation[];
        context: {
            endpoint: string;
        };
    };
    private findHeaderMismatches;
    private findPathParamMismatches;
    private findBodyMismatches;
    private getQueryParamsArraySerializationStrategy;
    private findQueryParamMismatches;
    private findMismatchOnStringContent;
    private getRelevantResponse;
    private getEndpointByRequest;
}
export declare const pathMatchesVariablePath: (variablePath: string, path: string) => boolean;
