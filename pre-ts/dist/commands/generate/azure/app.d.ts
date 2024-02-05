import { Command } from '@oclif/core';
export default class GenerateAzureApp extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        name: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    static args: {};
    run(): Promise<void>;
}
