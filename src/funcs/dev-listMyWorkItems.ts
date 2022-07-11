import axios from 'axios'
import chalk from 'chalk'
// import { readFileSync, writeFileSync } from 'fs';
import { stripHtml } from '../funcs/azgoUtils.js'

const pat = process.env.AZURE_DEVOPS_EXT_PAT


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


export function buildFilterQuery(filterOpts) {
  return filterOpts.reduce((all, item, index, array) => {
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
}

export async function getWorkItem(id: string, organization: string) {
  const { data } = await axios.default({
    method: "GET",
    url: `https://dev.azure.com/${organization}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`,
    auth: {
      username: "",
      password: pat,
    },
  })
  return data
}


export default async function listMyWorkItems({
  user = '',
  organization = '',
  filterType = null,
  filterState = null,
  groupBy = '',
  all,
  closed,
}: multiOptions) {

  let postUserSeparator = ''
  let filterSeparator = ''

  if (closed) {
    filterState = "[State] IN ('Removed', 'Closed','Done')"
  } else if (all) {
    filterState = ""
  } else if (filterState === null) {
    filterState = "[State] NOT IN ('Removed', 'Closed','Done')"
  } else if (filterState !== '') {
    filterState = `[State] IN ${filterState}`
  }


  if (filterType) {
    filterType = `[System.WorkItemType] IN ${filterType}`
  } else {
    filterType = ''
  }

  if (filterType && filterState) {
    filterSeparator = "AND"
  }

  if (filterType || filterState) {
    postUserSeparator = "AND"
  }

  const query = `Select [System.Id], [System.CreatedDate] From WorkItems Where [System.AssignedTo] = '${user}' ${postUserSeparator} ${filterType} ${filterSeparator} ${filterState} order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc`

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

      return res.data
    })

    return await Promise.all(workItems)

  } catch (err) {
    console.log(err)
    return err.message
  }
}
