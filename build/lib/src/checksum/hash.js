"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashContract = void 0;
const crypto_1 = require("crypto");
function hashContract(contract) {
    const contractDefinitionString = JSON.stringify(contract);
    return crypto_1.createHash("sha1").update(contractDefinitionString).digest("hex");
}
exports.hashContract = hashContract;
