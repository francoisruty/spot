import { Command } from "@oclif/command";
export interface LintConfig {
    rules: Record<string, string>;
}
/**
 * oclif command to lint a spot contract
 */
export default class Lint extends Command {
    static description: string;
    static examples: string[];
    static args: {
        name: string;
        required: boolean;
        description: string;
        hidden: boolean;
    }[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    run(): Promise<void>;
}
