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
exports.validateProject = exports.createProjectFromExistingSourceFile = exports.createProject = exports.createSourceFile = void 0;
const path = __importStar(require("path"));
const ts_morph_1 = require("ts-morph");
/**
 * Create an AST source file. Any files imported from the main file must also be provided.
 * All files will be loaded into a virtual filesystem under a `test/` directory.
 *
 * @param mainFile details for main file
 * @param referencedContent details for referenced files
 * @returns the main source file
 */
function createSourceFile(mainFile, ...referencedFiles) {
    const project = createProject();
    referencedFiles.forEach(fileDetail => {
        project.createSourceFile(`test/${fileDetail.path}.ts`, fileDetail.content);
    });
    const mainSource = project.createSourceFile(`test/${mainFile.path}.ts`, mainFile.content);
    validateProject(project);
    return mainSource;
}
exports.createSourceFile = createSourceFile;
/**
 * Create an AST project with the `@airtasker/spot` dependency loaded.
 */
function createProject() {
    return new ts_morph_1.Project({
        compilerOptions: {
            target: ts_morph_1.ts.ScriptTarget.ESNext,
            module: ts_morph_1.ts.ModuleKind.CommonJS,
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
            strictFunctionTypes: true,
            strictPropertyInitialization: true,
            noImplicitThis: true,
            alwaysStrict: true,
            noImplicitReturns: true,
            noFallthroughCasesInSwitch: true,
            moduleResolution: ts_morph_1.ts.ModuleResolutionKind.NodeJs,
            experimentalDecorators: true,
            baseUrl: "./",
            paths: {
                "@airtasker/spot": [path.join(__dirname, "../lib")]
            }
        }
    });
}
exports.createProject = createProject;
function createProjectFromExistingSourceFile(filePath) {
    const project = createProject();
    const file = project.addSourceFileAtPath(filePath);
    project.resolveSourceFileDependencies();
    validateProject(project);
    return { project, file };
}
exports.createProjectFromExistingSourceFile = createProjectFromExistingSourceFile;
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
exports.validateProject = validateProject;
