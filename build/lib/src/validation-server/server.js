"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordedResponseToUserInputResponse = exports.recordedRequestToUserInputRequest = exports.runValidationServer = void 0;
const express_1 = __importDefault(require("express"));
const contract_mismatcher_1 = require("./verifications/contract-mismatcher");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function runValidationServer(port, contract) {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.get("/health", (req, res) => {
        res.status(200).end();
    });
    app.post("/validate", (req, res) => {
        try {
            // TODO: Make sure body matches ValidateRequest, we should
            // send a 422 if it doesn't match
            const body = req.body;
            const userInputRequest = exports.recordedRequestToUserInputRequest(body.request);
            const userInputResponse = exports.recordedResponseToUserInputResponse(body.response);
            const contractValidator = new contract_mismatcher_1.ContractMismatcher(contract);
            const { violations, context } = contractValidator.findViolations(userInputRequest, userInputResponse);
            const responseBody = {
                interaction: {
                    request: body.request,
                    response: body.response
                },
                endpoint: context.endpoint,
                violations
            };
            res.json(responseBody);
        }
        catch (error) {
            res.status(500).send(makeInternalServerError([error.message]));
        }
    });
    return {
        app,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        defer: () => new Promise(resolve => app.listen(port, resolve))
    };
}
exports.runValidationServer = runValidationServer;
const makeInternalServerError = (messages) => {
    return {
        type: "internal_server",
        error_code: "500",
        error_messages: messages
    };
};
const recordedRequestToUserInputRequest = (recordedRequest) => {
    return {
        path: recordedRequest.path,
        method: recordedRequest.method,
        headers: recordedRequest.headers,
        body: recordedRequest.body && JSON.parse(recordedRequest.body)
    };
};
exports.recordedRequestToUserInputRequest = recordedRequestToUserInputRequest;
const recordedResponseToUserInputResponse = (recordedResponse) => {
    return {
        headers: recordedResponse.headers,
        statusCode: recordedResponse.status,
        body: recordedResponse.body && JSON.parse(recordedResponse.body)
    };
};
exports.recordedResponseToUserInputResponse = recordedResponseToUserInputResponse;
