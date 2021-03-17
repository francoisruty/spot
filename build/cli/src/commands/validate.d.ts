import { Command } from "@oclif/command";
/**
 * oclif command to validate a spot contract
 */
export default class Validate extends Command {
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
