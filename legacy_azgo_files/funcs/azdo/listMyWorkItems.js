/**
 * Checks Azure DevOps to see if a Project for provided organization
 *
 * @param {Object} config - Configuration object including organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @returns {Promise|Array} Object containing Project info if exists, or error
 */

const axios = require("axios").default
const { bold, red, italic, dim } = require("chalk")

// const { writeFileSync } = require("fs")

//  listMyWorkItems(require("../vars.json").env).then((data) => console.log(data))
// https://dev.azure.com/{{organization}}/_apis/wit/wiql?api-version=7.1-preview.2

// listMyWorkItems()

async function listMyWorkItems(username, org) {
  const pat = process.env.AZURE_DEVOPS_EXT_PAT
  const organization = org || process.env.AZGO_DEVOPS_ORG
  // let pat = undefined

  try {
    if (!pat) {
      throw new Error(`
        ${bold(red("ERROR: Environment variable AZURE_DEVOPS_EXT_PAT not set"))}

        ${italic(
          dim(`Obtain a Personal Access Token from https://dev.azure.com/${organization}/_usersSettings/tokens

        Then set the token as your environment variable using the following:
        Linux/macOS: export AZURE_DEVOPS_EXT_PAT=[token]
        Windows CMD: set AZURE_DEVOPS_EXT_PAT=[token]
        Winows Powershell: $env:AZURE_DEVOPS_EXT_PAT=[token]"

        mac with OnePass CLI: export AZURE_DEVOPS_EXT_PAT=$(op item get awe-devops-mbp --fields token)`)
        )}
        `)
    }
    const resp = await axios({
      method: "POST",
      url: `https://dev.azure.com/${organization}/_apis/wit/wiql?api-version=7.1-preview.2`,
      auth: {
        username: "",
        password: pat,
      },
      data: {
        query: `Select [System.Id], [System.CreatedDate] From WorkItems Where [System.AssignedTo] = '${username}' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc`,
      },
    })

    const workItems = resp.data.workItems.map(async (wi) => {
      const res = await axios({
        method: "get",
        url: `https://dev.azure.com/${organization}/_apis/wit/workItems/${wi.id}`,
        auth: {
          username: "",
          password: pat,
        },
      })
      const formattedWorkItem = {
        id: res.data.id,
        project: res.data.fields["System.TeamProject"],
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

    console.log(formattedWorkItems)

    return formattedWorkItems
  } catch (err) {
    console.log(err)
    return err.message
  }
}

module.exports = listMyWorkItems
