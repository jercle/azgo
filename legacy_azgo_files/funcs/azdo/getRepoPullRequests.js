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
// Microsoft Doco: https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-requests?view=azure-devops-rest-7.1#pullrequeststatus
 const axios = require('axios').default;

// For testing
// getRepoPullRequests(require('../vars.json').env).then(data => console.log(data))

async function getRepoPullRequests({ appName, organization, project, pat }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${appName}/pullRequests?api-version=6.1-preview.1`,
      // url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${appName}/pullRequests?api-version=6.1-preview.1&searchCriteria.status=all`,
      auth: {
        username: '',
        password: pat,
      },
      proxy: false
    })

  
    return response.data.value
  } catch (err) {
    return err;
  }
}

module.exports = getRepoPullRequests;
