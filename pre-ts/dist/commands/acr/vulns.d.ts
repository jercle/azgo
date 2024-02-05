import AzureCommand from "../../baseAzure.js";
export default class AcrVulns extends AzureCommand {
    static description: string;
    static examples: string[];
    static flags: {
        resourceGroup: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        acrRegistry: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        outfile: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        resyncData: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        groupBy: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        filter: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string[], import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        showCounts: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        detailedOutput: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        formatTable: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        formatCsv: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        listAllCves: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        uploadToDb: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        dbConnectionString: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    static args: {};
    run(): Promise<void>;
}
