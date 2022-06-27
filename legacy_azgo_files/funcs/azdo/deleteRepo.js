const axios = require('axios').default;

/**
 * Deletes a Repository in Azure DevOps using provided repoId
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project Team should be within
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @param {string} repoId - Id of the repo to be deleted
 * @returns Nothing is returned
 */
async function deleteRepo({ organization, project, pat }, repoId) {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repoId}?api-version=6.1-preview.1`,
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

module.exports = deleteRepo;
