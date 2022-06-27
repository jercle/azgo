const axios = require("axios").default

/**
 * Checks Azure DevOps to see if a Project for provided organization
 *
 * @param {Object} config - Configuration object including organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project to search
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @returns {Promise|Array} Object containing Project info if exists, or error
 */

// getProject(require('../vars.json').env).then(data => console.log(data))

async function getProject({ organization, project }) {
  let pat = process.env.AZURE_DEVOPS_EXT_PAT
  try {
    const resp = await axios({
      method: "GET",
      url: `https://dev.azure.com/${organization}/_apis/projects/${project}?api-version=6.1-preview.4`,
      auth: {
        username: "",
        password: pat,
      },
    })
    const { status, statusText } = resp
    const { id, name, description } = resp.data
    const defaultTeam = {
      name: resp.data.defaultTeam.name,
      id: resp.data.defaultTeam.id,
    }

    let res = {
      type: "project",
      name,
      description,
      exists: true,
      status,
      statusText,
      id,
      defaultTeam,
    }

    return res
  } catch (err) {
    const res = {
      type: "project",
      name: project,
      exists: false,
      status: err.response.status,
      statusText: err.response.statusText,
      message: err.response.data.message,
    }

    return res
  }
}

module.exports = getProject
