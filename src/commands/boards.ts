import { Flags } from '@oclif/core'
import chalk from 'chalk'


import AzureDevOpsCommand from "../baseAzureDevOps.js"
import listMyWorkItems from '../funcs/dev-listMyWorkItems.js'



type multiOptions = {
  user: any;
  organization: any;
  id: string;
  list: boolean;
  onlyCount: boolean;
  groupBy: string;
  filterType: any[];
  filterState: any[];
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






  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Boards)
    const user = flags.user || Boards.subscriptions.default.username
    // const { includeClosed, includePending, onlyBugs } = flags
    let options: any = {
      ...flags,
      user,
      organization: flags['organization']
    }

    // console.log(flags)
    // console.log(options)
    // console.log(user)

    // if (flags.id) {
    //   workItem = getWorkItem(options.id)
    //   console.log(workItem)
    //   process.exit()
    // }

    if (flags.all || flags.closed || flags.open) {
      const workItems = listMyWorkItems(options)
      console.log(workItems)
      process.exit()
    }

    if (flags.filterState) {
      // console.log(flags)
      // console.log(options.filterState.join(','))
      options.filterState = options.filterState.reduce((all, item, index, array) => {
        // console.log(index, array.length - 1)
        // return index === 0 ? all + "'item'" : all + ", item'"
        if (index === 0) {
          if (index === array.length - 1) {
            return all + `'${item}')`
          } else {
            return all + `'${item}'`
          }
        } else if (index === array.length - 1) {
          return all + `, '${item}')`
        } else {
          return all + `, '${item}'`
        }
      }, "(")
      // console.log(filterByState)
      // process.exit()
    }
    if (flags.filterType) {
      // console.log(flags)
      // console.log(options.filterType.join(','))
      options.filterType = options.filterType.reduce((all, item, index, array) => {
        // console.log(index, array.length - 1)
        // return index === 0 ? all + "'item'" : all + ", item'"
        if (index === 0) {
          if (index === array.length - 1) {
            return all + `'${item}')`
          } else {
            return all + `'${item}'`
          }
        } else if (index === array.length - 1) {
          return all + `, '${item}')`
        } else {
          return all + `, '${item}'`
        }
      }, "(")
      // console.log(filterByType)
      // process.exit()
    }

    // console.log(options)
    // process.exit()
    // let thing = 'this thing'

    // thing.

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
          areaPath: wi.areaPath,
          state: wi.state,
          title: wi.title
        })
      })

      process.exit()
    }

    // this.config.runCommand('help', ['boards'])
  }
}
