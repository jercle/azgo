import { Command, Flags } from '@oclif/core'
import { readFileSync } from 'fs'
import inquierer from 'inquirer'


export default class GenerateAzureApp extends Command {
  static description = 'Create Azure pipeline and armconfig files from template'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'Name of Application' }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({ char: 'f' }),
  }

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenerateAzureApp)
    // let tpl = readFileSync(`${__dirname}/../../../../templates/azure/app.tpl`, 'utf8')
    console.log('Currently not functional')
  }
}




// inquirer
// .prompt({
//   type: "string",
//   name: "subscriptionId",
//   message: "Choose subscription",
//   choices: subs,
// })
// .then((answer) => {
//   appCache.set("selectedSubscription", answer.subscriptionId)
// })
