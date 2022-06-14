const axios = require('axios').default;

/**
 * Checks Azure DevOps to see if a Repository exists in a project
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.appName - Name of the repository being searched
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project Team should be within
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @returns {Promise|Array} Object containing Repo info if exists, or error
 */

// For testing
// getRepo(require('../vars.json').env).then(data => console.log(data))

async function getRepo({ appName, organization, project, pat }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${appName}?api-version=6.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
      proxy: false
    });

    const res = {
      type: 'repository',
      name: appName,
      exists: true,
      status: response.status,
      statusText: response.statusText,
      id: response.data.id,
      name: response.data.name,
      projectName: response.data.project.name,
      webUrl: response.data._links.web.href,
      commits: response.data._links.commits.href,
      pullRequests: response.data._links.pullRequests.href,
      pushes: response.data._links.pushes.href,
    };
    return res;
  } catch (err) {
    const res = {
      type: 'repository',
      name: appName,
      exists: false,
      status: err.response.status,
      statusText: err.response.statusText,
      message: err.response.data.message,
    };
    return res;
  }
}

module.exports = getRepo;
