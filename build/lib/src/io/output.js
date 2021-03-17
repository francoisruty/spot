"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const expand_path_with_tilde_1 = require("../utilities/expand-path-with-tilde");
function outputFile(outDir, relativePath, content, override = true) {
    const destinationPath = path_1.default.join(expand_path_with_tilde_1.expandPathWithTilde(outDir), relativePath);
    fs_extra_1.default.mkdirpSync(path_1.default.dirname(destinationPath));
    if (!override && fs_extra_1.default.existsSync(destinationPath)) {
        // Skip.
        return false;
    }
    fs_extra_1.default.writeFileSync(destinationPath, content, "utf8");
    return true;
}
exports.outputFile = outputFile;
