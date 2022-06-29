import { Command, Flags } from '@oclif/core'
import { showDebug, checkCache } from '../../funcs/azgoUtils.js'

export default class AcrIndex extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({
      char: 'n',
      description: 'name to print',
      helpGroup: 'GLOBAL'
    }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),

  }

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AcrIndex)



    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from /Users/jercle/git/azgo/src/commands/acr/index.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}