import AzureDevOpsCommand from "../../../../baseAzureDevOps.js";
export default class AdoReposPrList extends AzureDevOpsCommand {
    static description: string;
    static examples: string[];
    static flags: {
        name: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        force: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    static args: {
        file: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
