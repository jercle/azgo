const axios = require('axios').default;

/**
 * Checks Azure DevOps to see if a Team exists in a project
 *
 * @param {Object} config Configuration object including appName, organization, project, pat
 * @param {string} config.appName Name of the team being searched
 * @param {string} config.organization Name of the organization in Azure DevOps
 * @param {string} config.project Name of project Team should be within
 * @param {string} config.pat Personal Access Token from Azure DevOps
 * @returns {Promise|Array} Object containing Team info if exists, or error
 */
async function getTeam({ appName, organization, project, pat }) {
  try {
    const data = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/_apis/projects/${project}/teams/${appName}?api-version=6.1-preview.3`,
      auth: {
        username: '',
        password: pat,
      },
    });

    const { status, statusText } = data;

    const { id, name, projectName } = data.data;
    const res = {
      type: 'team',
      name: appName,
      exists: true,
      status,
      statusText,
      id,
      name,
      projectName,
    };
    return res;
  } catch (err) {
    const res = {
      type: 'team',
      name: appName,
      exists: false,
      status: err.response.status,
      statusText: err.response.statusText,
      message: err.response.data.message,
    };
    return res;
  }
}

module.exports = getTeam;
