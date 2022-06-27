/**
 * Checks Azure DevOps to see if a Project for provided organization
 *
 * @param {Object} config - Configuration object including organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @returns {Promise|Array} Object containing Project info if exists, or error
 */

const axios = require("axios").default
const {bold, red, italic, dim} = require("chalk")

listProjects(require("../vars.json").env).then((data) => console.log(data))

async function listProjects({ organization }) {
// async function listProjects({ organization }, pat) {
  let pat = process.env.AZURE_DEVOPS_EXT_PAT
  // let pat = undefined

  try {
    if (!pat) {
      throw new Error(`
       ${bold(red("ERROR: Environment variable AZURE_DEVOPS_EXT_PAT not set"))}

       ${italic(dim(`Obtain a Personal Access Token from https://dev.azure.com/${organization}/_usersSettings/tokens

       Then set the token as your environment variable using the following:
       Linux/macOS: export AZURE_DEVOPS_EXT_PAT=[token]
       Windows CMD: set AZURE_DEVOPS_EXT_PAT=[token]
       Winows Powershell: $env:AZURE_DEVOPS_EXT_PAT=[token]"

       mac with OnePass CLI: export AZURE_DEVOPS_EXT_PAT=$(op item get awe-devops-mbp --fields token)`))}
       `)
    }
    const resp = await axios({
      method: "GET",
      url: `https://dev.azure.com/${organization}/_apis/projects/?api-version=6.1-preview.4`,
      auth: {
        username: "",
        password: pat,
      },
    })

    const projects = resp.data.value.reduce((all, item) => {
      all[item.name] = {
        id: item.id,
        name: item.name,
        description: item.description,
        url: item.url,
      }
      return all
    }, {})

    return projects
  } catch (err) {
    return err.message
  }
}

module.exports = listProjects
