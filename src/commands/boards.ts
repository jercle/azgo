import { Flags } from '@oclif/core'
import { mapTag } from 'yaml/util'

import AzureDevOpsCommand from "../baseAzureDevOps.js"
import listMyWorkItems from '../funcs/dev-listMyWorkItems.js'



type multiOptions = {
  user: any;
  organization: any;
  id: string;
  list: boolean;
  onlyCount: boolean;
  groupBy: string;
  filterType: string | any[];
  filterState: string | any[];
}


export default class Boards extends AzureDevOpsCommand {
  static description = `Azure DevOps Boards related commands

  Current functionality is listing all items, with some filtering`

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    id: Flags.string({
      char: 'i',
      description: 'ID of the work item to display',
      exclusive: ['list'],
    }),
    user: Flags.string({
      char: 'u', description: `User's full name or Email address used for Azure DevOps login
    "John Smith" or "john.smith@org.com.au" to filter by assignment

    NOTE: If not provided, email address used with current active subscription will be used.
    This can be found or changed with the "azgo subs" command.`}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    list: Flags.boolean({
      char: 'l',
      description: "List all work items assigned to given user"
    }),
    onlyCount: Flags.boolean({
      char: 'c',
      description: "Only show count of items",
      dependsOn: ['list']
    }),
    groupBy: Flags.string({
      char: 'g',
      description: 'Group by state or type',
      options: ['state', 'type'],
      dependsOn: ['list']
    }),
    filterType: Flags.string({
      char: 't',
      description: "Filter on type",
      multiple: true,
      dependsOn: ['list'],
      options: [
        'bug',
        'task',
        'decision',
        'epic',
        'feature',
        'impediment',
        'pbi',
        'risk'
      ],
      parse: async input => {
        if (input === 'pbi') {
          return 'product backlog item'
        } else {
          return input
        }
      }
    }),
    filterState: Flags.string({
      char: 's',
      description: `Filter on state.
      'open', 'closed', and 'all' are generic states and do not map to actual work item states.
      They simply return all items with open states, closed/removed states, or any state.`,
      multiple: true,
      dependsOn: ['list'],
      options: [
        'todo',
        'inprogress',
        'done',
        'removed',
        'open',
        'closed',
        'new',
        'approved',
        'committed',
        'considered',
        'identify',
        'analyse',
        'evaluate',
        'treat',
        'monitor',
        'all'
      ],
      parse: async input => {
        if (input === 'todo') {
          return 'To Do'
        } else if (input === 'inprogress') {
          return 'In Progress'
        } else {
          return input
        }
      }
    }),
  }






  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Boards)
    const user = flags.user || Boards.subscriptions.default.username
    // const { includeClosed, includePending, onlyBugs } = flags
    const options: multiOptions = {
      ...flags,
      user,
      organization: flags['organization']
    }

    // console.log(flags)
    // console.log(user)

    if (flags.filterState) {
      console.log(flags)
      process.exit()
    }

    if (flags.onlyCount) {
      const workItems = await listMyWorkItems(options)
      workItems.length != 0 && workItems.length > 1 ?
        console.log(`${workItems.length} items`) :
        console.log(`${workItems.length} item`)

      process.exit()
    }

    if (flags.list) {
      const workItems = await listMyWorkItems(options)
      // console.log(workItems)
      workItems.map(wi => {
        console.log({
          id: wi.id,
          project: wi.project,
          state: wi.state,
          title: wi.title
        })
      })

      process.exit()
    }

    // this.config.runCommand('help', ['boards'])
  }
}
