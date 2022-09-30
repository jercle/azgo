import { Command, Flags } from '@oclif/core'

export default class AcrReposPurge extends Command {
  static description = 'Purges old container images from ACR'

  // static examples = [
  //   '<%= config.bin %> <%= command.id %>',
  // ]

  static flags = {
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
  }

  // static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AcrReposPurge)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/jercle/git/azgo/src/commands/acr/repos/purge.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
