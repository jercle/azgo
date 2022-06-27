import {Command, Flags} from '@oclif/core'

export default class AcrList extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
  }

  static args = []

  public async run(): Promise<void> {
    // const {args, flags} = await this.parse(AcrList)

  }
}
