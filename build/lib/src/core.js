"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchema = exports.OpenApi3 = exports.OpenApi2 = exports.parseContract = void 0;
const JsonSchema = __importStar(require("./generators/json-schema"));
exports.JsonSchema = JsonSchema;
const OpenApi2 = __importStar(require("./generators/openapi2"));
exports.OpenApi2 = OpenApi2;
const OpenApi3 = __importStar(require("./generators/openapi3"));
exports.OpenApi3 = OpenApi3;
const parser_1 = require("./parser");
Object.defineProperty(exports, "parseContract", { enumerable: true, get: function () { return parser_1.parse; } });
