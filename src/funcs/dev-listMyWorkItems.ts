/**
 * Checks Azure DevOps to see if a Project for provided organization
 *
 * @param {Object} config - Configuration object including organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @returns {Promise|Array} Object containing Project info if exists, or error
 */

// const axios = require("axios").default
import axios from 'axios'
// const { bold, red, italic, dim } = require("chalk")
import chalk from 'chalk'

const pat = process.env.AZURE_DEVOPS_EXT_PAT

// const { writeFileSync } = require("fs")

// https://dev.azure.com/{{organization}}/_apis/wit/wiql?api-version=7.1-preview.2

// listMyWorkItems('')

type multiOptions = {
  user: any;
  organization: any;
  id: string;
  list: boolean;
  onlyCount: boolean;
  groupBy: string;
  filterType: string;
  filterState: string;
  open: boolean;
  closed: boolean;
  all: boolean;
}

// export default async function listMyWorkItems({
//   user = '',
//   organization = '',
//   filterType = [],
//   filterState = [],
//   groupBy = '',
//   id = ''
// }) {



// getWorkItem('256824', 'agriculturegovau')

export async function getWorkItem(id: string, organization: string) {
  // const workItem = await listMyWorkItems(options)
  // return workItem.find(wi => wi.id === id)
  const { data } = await axios.default({
    method: "GET",
    url: `https://dev.azure.com/${organization}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`,
    auth: {
      username: "",
      password: pat,
    },
  })
  console.log(data)

}


export default async function listMyWorkItems({
  user = '',
  organization = '',
  filterType = "",
  filterState = "",
  groupBy = '',
  all,
  closed,
}: multiOptions) {

  let postUserSeparator = ''
  let filterSeparator = ''


  if (filterState === '') {
    filterState = "[State] NOT IN ('Removed', 'Closed','Done')"
  } else if (closed) {
    filterState = "[State] IN ('Removed', 'Closed','Done')"
  } else if (all) {
    filterState = ""
  } else if (filterState !== '') {
    filterState = `[State] IN ${filterState}`
  }

  // [System.WorkItemType]

  if (filterType) {
    filterType = `[System.WorkItemType] IN ${filterType}`
  }

  if (filterType && filterState) {
    filterSeparator = "AND"
  }

  if (filterType || filterState) {
    postUserSeparator = "AND"
  }


  const query = `Select [System.Id], [System.CreatedDate] From WorkItems Where [System.AssignedTo] = '${user}' ${postUserSeparator} ${filterType} ${filterSeparator} ${filterState} order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc`
  // console.log('filterState', filterState)
  // console.log('filterType', filterType)
  // console.log(query)

  // process.exit()

  try {
    if (!pat) {
      throw new Error(`
         ${chalk.bold(chalk.red("ERROR: Environment variable AZURE_DEVOPS_EXT_PAT not set"))}

         ${chalk.italic(
        chalk.dim(`Obtain a Personal Access Token from https://dev.azure.com/${organization}/_usersSettings/tokens

         Then set the token as your environment variable using the following:
         Linux/macOS: export AZURE_DEVOPS_EXT_PAT=[token]
         Windows CMD: set AZURE_DEVOPS_EXT_PAT=[token]
         Winows Powershell: $env:AZURE_DEVOPS_EXT_PAT=[token]"

         mac with OnePass CLI: export AZURE_DEVOPS_EXT_PAT=$(op item get awe-devops-mbp --fields token)`)
      )}
         `)
    }

    // const filterByState = filterSate.map(state => {

    // })

    // let query = ''
    // const query = `Select [System.Id], [System.CreatedDate] From WorkItems Where [System.AssignedTo] = '${user}' AND ${filterType} ${and} ${filterState} order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc`
    // let filter = ''

    // let query = ''

    // if (filterType) {
    //   query = `Select [System.Id], [System.CreatedDate] From WorkItems Where [System.WorkItemType] = '${filterType}' AND [System.AssignedTo] = '${user}' AND [State] NOT IN ${filter} order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc`
    // } else {
    // }

    // console.log(query)

    const resp = await axios.default({
      method: "POST",
      url: `https://dev.azure.com/${organization}/_apis/wit/wiql?api-version=7.1-preview.2`,
      auth: {
        username: "",
        password: pat,
      },
      data: {
        query

      },
    })

    const workItems = resp.data.workItems.map(async (wi) => {
      const res = await axios.default({
        method: "get",
        url: `https://dev.azure.com/${organization}/_apis/wit/workItems/${wi.id}`,
        auth: {
          username: "",
          password: pat,
        },
      })
      const formattedWorkItem = {
        id: res.data.id,
        areaPath: res.data.fields["System.AreaPath"],
        // project: res.data.fields["System.TeamProject"],
        state: res.data.fields["System.State"],
        workItemType: res.data.fields["System.WorkItemType"],
        assignedTo: res.data.fields["System.AssignedTo"].displayName,
        title: res.data.fields["System.Title"],
        htmlLink: res.data["_links"].html.href,
        latestComment: res.data.fields["System.History"] || null,
        createdDate: res.data.fields["System.CreatedDate"],
        modifiedDate: res.data.fields["System.ChangedDate"],
      }

      return formattedWorkItem
    })

    const formattedWorkItems = await Promise.all(workItems)

    // console.log(formattedWorkItems)

    return formattedWorkItems

  } catch (err) {
    console.log(err)
    return err.message
  }
}

// module.exports = listMyWorkItems
