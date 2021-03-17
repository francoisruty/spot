import { Contract } from "../definitions";
import { RecordedRequest, RecordedResponse } from "./spots/validate";
import { UserInputRequest, UserInputResponse } from "./verifications/user-input-models";
export declare function runValidationServer(port: number, contract: Contract): {
    app: import("express-serve-static-core").Express;
    defer: () => Promise<void>;
};
export declare const recordedRequestToUserInputRequest: (recordedRequest: RecordedRequest) => UserInputRequest;
export declare const recordedResponseToUserInputResponse: (recordedResponse: RecordedResponse) => UserInputResponse;
