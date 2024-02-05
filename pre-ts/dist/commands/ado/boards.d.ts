import AzureDevOpsCommand from "../../baseAzureDevOps.js";
export default class Boards extends AzureDevOpsCommand {
    static description: string;
    static examples: string[];
    static flags: {
        id: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        list: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        onlyCount: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        groupBy: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        filterType: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string[], import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        filterState: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string[], import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        closed: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        all: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    static args: {};
    run(): Promise<void>;
}
