const axios = require('axios').default;

/**
 * Description: Get descriptors for use in Azure DevOps object (user, group, etc) creation
 *
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @returns Descriptors of objec
 */
async function getProjectDescriptors({ organization, pat }, projectId) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://vssps.dev.azure.com/${organization}/_apis/graph/descriptors/${projectId}?api-version=5.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
    });
    return res.data.value;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = getProjectDescriptors;
