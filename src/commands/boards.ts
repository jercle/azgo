import { Flags } from '@oclif/core'

import AzureDevOpsCommand from "../baseAzureDevOps.js"
import listMyWorkItems from '../funcs/dev-listMyWorkItems.js'

export default class Boards extends AzureDevOpsCommand {
  static description = `Azure DevOps Boards related commands

  Current functionality is listing all items`

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    user: Flags.string({
      char: 'u', description: `User's full name or Email address used for Azure DevOps login
    "John Smith" or "john.smith@org.com.au"

    NOTE: If not provided, email address used with current active subscription will be used.
    This can be found or changed with the "azgo subs" command.`}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    list: Flags.boolean({
      char: 'l',
      description: "List all work items assigned to given user"
    }),
    includeClosed: Flags.boolean({
      char: 'a',
      description: "Include closed work items",
      dependsOn: ['list'],
      exclusive: ['includePending']
    }),
    includePending: Flags.boolean({
      char: 'p',
      description: "Include pending work items",
      dependsOn: ['list'],
      exclusive: ['includeClosed']
    }),
    filterType: Flags.string({
      char: 'f',
      description: "Filter on type",
      dependsOn: ['list'],
      options: ['Bug', 'Task']
      // options: ['Bug', 'Task', 'Feature', 'Epic', 'User Story', 'Test']
    }),
  }

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Boards)
    const user = flags.user || Boards.subscriptions.default.username
    // const { includeClosed, includePending, onlyBugs } = flags
    const options = {
      ...flags,
      user,
      organization: flags['organization']
    }

    // console.log(flags)
    // console.log(user)

    if (flags.list) {
      const workItems = await listMyWorkItems(options)
      workItems.length != 0 && workItems.length > 1 ?
        console.log(`${workItems.length} items`) :
        console.log(`${workItems.length} item`)

      process.exit()
    }

    // this.config.runCommand('help', ['boards'])
  }
}
