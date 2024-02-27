const axios = require('axios').default;

/**
 * Deletes group using provided groupDescriptor
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.appName - Name of the repository being searched
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project Team should be within
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @param {string} groupDescriptor - Groups groupDescriptor property of Group as provided by Azure DevOps
 * @returns Nothing is returned. No data provided by Azure DevOps api to return
 */
async function deleteGroup({ organization, pat }, groupDescriptor) {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `https://vssps.dev.azure.com/${organization}/_apis/graph/groups/${groupDescriptor}?api-version=6.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = deleteGroup;
