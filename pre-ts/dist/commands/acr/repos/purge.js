import { Command, Flags } from '@oclif/core';
class AcrReposPurge extends Command {
    // static args = [{ name: 'file' }]
    async run() {
        var _a;
        const { args, flags } = await this.parse(AcrReposPurge);
        const name = (_a = flags.name) !== null && _a !== void 0 ? _a : 'world';
        this.log(`hello ${name} from /Users/jercle/git/azgo/src/commands/acr/repos/purge.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
AcrReposPurge.description = 'Purges old container images from ACR';
// static examples = [
//   '<%= config.bin %> <%= command.id %>',
// ]
AcrReposPurge.flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    executeDelete: Flags.boolean({
        description: 'Runs the deletion of images',
    }),
    retentionDays: Flags.integer({
        char: 'r',
        description: 'Only purge images older than number of days provided',
        default: 30
    })
};
export default AcrReposPurge;
// TODO: Get list of all images
// TODO: Get list of all images in use
