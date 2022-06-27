const axios = require('axios').default;

/**
 * Creates a Team in an Azure DevOps project
 *
 * @param {Object} config - Object including appName, organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @returns {Object} type, status, statusText, id, name, descriptor
 */

async function createTeam({ organization, project, appName, pat }) {
  try {
    const res = await axios({
      method: 'POST',
      url: `https://dev.azure.com/${organization}/_apis/projects/${project}/teams?api-version=6.1-preview.3`,
      data: {
        name: `${appName} Team`,
      },
      auth: {
        username: '',
        password: pat,
      },
    });

    const response = {
      type: 'team',
      status: res.status,
      statusText: res.statusText,
      id: res.data.id,
      name: res.data.identity.providerDisplayName,
      descriptor: res.data.identity.descriptor,
    };

    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = createTeam;
