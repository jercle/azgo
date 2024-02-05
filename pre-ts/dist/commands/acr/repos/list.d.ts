import AzureCommand from "../../../baseAzure.js";
export default class AcrReposList extends AzureCommand {
    static description: string;
    static examples: string[];
    static flags: {
        acrRegistry: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        outfile: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        includeManifests: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        resyncData: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    static args: {};
    run(): Promise<void>;
}
