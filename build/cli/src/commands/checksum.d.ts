import { Command } from "@oclif/command";
/**
 * oclif command to generate a checksum for a Spot contract
 */
export default class Checksum extends Command {
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
