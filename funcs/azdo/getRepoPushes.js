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
 const axios = require('axios').default;
// For testing
// getRepoPushes(require('../vars.json').env).then(data => console.log(data))

async function getRepoPushes({ appName, organization, project, pat }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${appName}/pushes?api-version=6.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
      proxy: false
    })
    const pushes = response.data.value.map(push => {
      return {
        id: push.pushId,
        pushedByName: push.pushedBy.displayName,
        pushedByEmail: push.pushedBy.uniqueName,
        date: push.date,
        pushUrl: push.url
      }
    })
    return pushes
  } catch (err) {
    return err;
  }
}

module.exports = getRepoPushes;
