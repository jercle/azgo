import { Flags } from '@oclif/core'
import { format } from 'path'
import { env } from 'process'

import AzureDevOpsCommand from "../baseAzureDevOps.js"
import { formatWorkItems, printWorkItems } from '../funcs/azgoUtils.js'
import listMyWorkItems, { buildFilterQuery, getWorkItem } from '../funcs/dev-listMyWorkItems.js'


export default class Boards extends AzureDevOpsCommand {
  static description = `Azure DevOps Boards related commands

  Current functionality is listing all items, with some filtering`

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'ID of the work item to display',
      exclusive: ['list'],
    }),
    user: Flags.string({
      char: 'u', description: `User's full name or Email address used for Azure DevOps login
    "John Smith" or "john.smith@org.com.au" to filter by assignment
    Useful when Azure DevOps user is different to Azure subscription user.

    NOTE: If not provided, email address used with current active subscription will be used.
    This can be found or changed with the "azgo subs" command.`,
      env: 'AZGO_DEVOPS_USER',
    }),
    list: Flags.boolean({
      char: 'l',
      description: 'List all work items assigned to given user',
      exclusive: ['id'],
    }),

    onlyCount: Flags.boolean({
      char: 'c',
      description: "Only show count of items",
      exclusive: ['id']
    }),
    // groupBy: Flags.string({
    //   char: 'g',
    //   description: 'Group by state or type',
    //   options: ['state', 'type'],
    //   dependsOn: ['list']
    // }),
    filterText: Flags.string({
      char: 'f',
      description: 'Filter by text in Title and Description',
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
      By default, returns work items in all open states

      Can optionally use --closed (Only closed) or --all (all states)`,
      multiple: true,
      dependsOn: ['list'],
      options: [
        'todo',
        'inprogress',
        'done',
        'removed',
        'new',
        'approved',
        'committed',
        'considered',
        'identify',
        'analyse',
        'evaluate',
        'treat',
        'monitor',
        'open',
        'closed',
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
    closed: Flags.boolean({
      description: 'Return all work items in any CLOSED state',
      exclusive: ['filterState', 'open', 'all']
    }),
    all: Flags.boolean({
      description: 'Return all work items in ANY state',
      exclusive: ['filterState', 'closed', 'open']
    }),
  }

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Boards)
    const user = flags.user || Boards.subscriptions.default.username
    let options: any = {
      ...flags,
      user,
      organization: flags['organization']
    }


    if (flags.id) {
      const workItem = await getWorkItem(options.id, options.organization)
      printWorkItems(formatWorkItems([workItem]))
      process.exit()
    }

    options.filterState = flags.filterState && buildFilterQuery(options.filterState) || null
    options.filterType = flags.filterType && buildFilterQuery(options.filterType) || null

    let workItems = await listMyWorkItems(options)

    if (flags.onlyCount) {
      workItems.length != 0 && workItems.length > 1 ?
        console.log(`${workItems.length} items`) :
        console.log(`${workItems.length} item`)
      process.exit()
    }

    if (flags.list) {
      if (flags.filterText) {
        workItems = formatWorkItems(workItems).filter(item => {
          return item.title.toLowerCase().includes(flags.filterText.toLowerCase()) ||
            item.description.toLowerCase().includes(flags.filterText.toLowerCase())
        })
      } else {
        workItems = formatWorkItems(workItems)
      }

      // console.log(workItems)

      printWorkItems(workItems)
      process.exit()
    }
  }
}
