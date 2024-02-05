import AzureDevOpsCommand from "../../../baseAzureDevOps.js";
export default class ConfigDevopsDefaultSub extends AzureDevOpsCommand {
    static description: string;
    static examples: string[];
    static flags: {
        select: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    static args: {
        file: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
