const axios = require('axios').default;

/**
 * Searches provided project ID or name and returns array of all groups found
 *
 * @param {Object} config - Configuration object
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @param {string} projectScopeDescriptor - Descriptor of the project, provided by Azure DevOps
 * @returns {Array} Array of all groups found for provided project
 */
async function getProjectGroups({ organization, pat }, projectScopeDescriptor) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://vssps.dev.azure.com/${organization}/_apis/graph/groups?scopeDescriptor=${projectScopeDescriptor}&api-version=6.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = getProjectGroups;
