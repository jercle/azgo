import { Args, Flags } from '@oclif/core';
import AzureDevOpsCommand from "../../../../baseAzureDevOps.js";
class AdoReposPrList extends AzureDevOpsCommand {
    async run() {
        var _a;
        const { args, flags } = await this.parse(AdoReposPrList);
        const name = (_a = flags.name) !== null && _a !== void 0 ? _a : 'world';
        this.log(`hello ${name} from /home/ec2-user/git/azgo/src/commands/ado/repos/pr/list.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
AdoReposPrList.description = 'describe the command here';
AdoReposPrList.examples = [
    '<%= config.bin %> <%= command.id %>',
];
AdoReposPrList.flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
};
AdoReposPrList.args = {
    file: Args.string({ description: 'file to read' }),
};
export default AdoReposPrList;
