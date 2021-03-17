"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpecificResponse = void 0;
/** Type guards */
function isSpecificResponse(response) {
    return "status" in response;
}
exports.isSpecificResponse = isSpecificResponse;
