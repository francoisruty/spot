import { Command } from "@oclif/command";
export default class Docs extends Command {
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
