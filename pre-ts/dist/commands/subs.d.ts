import AzureCommand from "../baseAzure.js";
export default class Subs extends AzureCommand {
    static description: string;
    static examples: any[];
    static flags: {
        showActive: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        setActive: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    static args: {};
    run(): Promise<void>;
}
