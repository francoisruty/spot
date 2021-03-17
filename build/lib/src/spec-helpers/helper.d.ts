import { Project, SourceFile } from "ts-morph";
/**
 * Create an AST source file. Any files imported from the main file must also be provided.
 * All files will be loaded into a virtual filesystem under a `test/` directory.
 *
 * @param mainFile details for main file
 * @param referencedContent details for referenced files
 * @returns the main source file
 */
export declare function createSourceFile(mainFile: FileDetail, ...referencedFiles: FileDetail[]): SourceFile;
interface FileDetail {
    /** File path */
    path: string;
    /** File content */
    content: string;
}
/**
 * Create an AST project with the `@airtasker/spot` dependency loaded.
 */
export declare function createProject(): Project;
export declare function createProjectFromExistingSourceFile(filePath: string): {
    project: Project;
    file: SourceFile;
};
/**
 * Validate an AST project's correctness.
 *
 * @param project an AST project
 */
export declare function validateProject(project: Project): void;
export {};
