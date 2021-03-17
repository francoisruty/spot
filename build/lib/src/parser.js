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
exports.parse = void 0;
const path = __importStar(require("path"));
const ts_morph_1 = require("ts-morph");
const contract_parser_1 = require("./parsers/contract-parser");
function parse(sourcePath) {
    const project = createProject();
    // Add all dependent files that the project requires
    const sourceFile = project.addSourceFileAtPath(sourcePath);
    project.resolveSourceFileDependencies();
    // Validate that the project has no TypeScript syntax errors
    validateProject(project);
    const result = contract_parser_1.parseContract(sourceFile);
    // TODO: print human readable errors
    if (result.isErr())
        throw result.unwrapErr();
    return result.unwrap().contract;
}
exports.parse = parse;
/**
 * Create a new project configured for Spot
 */
function createProject() {
    const compilerOptions = {
        target: ts_morph_1.ts.ScriptTarget.ESNext,
        module: ts_morph_1.ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        noImplicitThis: true,
        resolveJsonModule: true,
        alwaysStrict: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: ts_morph_1.ts.ModuleResolutionKind.NodeJs,
        experimentalDecorators: true,
        baseUrl: "./",
        paths: {
            "@airtasker/spot": [path.join(__dirname, "../lib")]
        }
    };
    // Creates a new typescript program in memory
    return new ts_morph_1.Project({ compilerOptions });
}
/**
 * Validate an AST project's correctness.
 *
 * @param project an AST project
 */
function validateProject(project) {
    const diagnostics = project.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
        throw new Error(diagnostics
            .map(diagnostic => {
            const message = diagnostic.getMessageText();
            return typeof message === "string"
                ? message
                : message.getMessageText();
        })
            .join("\n"));
    }
}
