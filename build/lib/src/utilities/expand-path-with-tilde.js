"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandPathWithTilde = void 0;
const os_1 = __importDefault(require("os"));
function expandPathWithTilde(path) {
    const homeDir = os_1.default.homedir();
    if (!homeDir) {
        return path;
    }
    return path.replace(/^~(?=\/|\\)/, homeDir);
}
exports.expandPathWithTilde = expandPathWithTilde;
