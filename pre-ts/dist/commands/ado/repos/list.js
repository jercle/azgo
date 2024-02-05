import { Args, Command, Flags } from '@oclif/core';
class AdoReposList extends Command {
    async run() {
        var _a;
        const { args, flags } = await this.parse(AdoReposList);
        const name = (_a = flags.name) !== null && _a !== void 0 ? _a : 'world';
        this.log(`hello ${name} from /home/ec2-user/git/azgo/src/commands/ado/repos/list.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
AdoReposList.description = 'describe the command here';
AdoReposList.examples = [
    '<%= config.bin %> <%= command.id %>',
];
AdoReposList.flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
};
AdoReposList.args = {
    file: Args.string({ description: 'file to read' }),
};
export default AdoReposList;
