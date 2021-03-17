import { Command, flags } from "@oclif/command";
export default class Generate extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        contract: flags.IOptionFlag<string>;
        language: flags.IOptionFlag<string | undefined>;
        generator: flags.IOptionFlag<string | undefined>;
        out: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
