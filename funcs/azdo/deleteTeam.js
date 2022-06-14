const axios = require('axios').default;

/**
 * Delets a Team in Azure DevOps using provided teamId
 *
 * @param {Object} config - Configuration object including organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project Team should be within
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @param {string} teamId Id of team to be deleted
 * @returns Nothings is returned
 */
async function deleteTeam({ organization, project, pat }, teamId) {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `https://dev.azure.com/${organization}/_apis/projects/${project}/teams/${teamId}?api-version=6.1-preview.3`,
      auth: {
        username: '',
        password: pat,
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

module.exports = deleteTeam;
