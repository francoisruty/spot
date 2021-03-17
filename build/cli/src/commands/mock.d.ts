import { Command, flags } from "@oclif/command";
/**
 * oclif command to run a mock server based on a Spot contract
 */
export default class Mock extends Command {
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
        proxyBaseUrl: flags.IOptionFlag<string | undefined>;
        port: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        pathPrefix: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
