import { Command } from "@oclif/command";
/**
 * oclif command to start the spot contract validation server
 */
export default class ValidationServer extends Command {
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
        port: import("@oclif/parser/lib/flags").IOptionFlag<number>;
    };
    run(): Promise<void>;
}
