const axios = require('axios').default;

/**
 * Creates a Repository in an Azure DevOps project
 *
 * @param {Object} config - Object including appName, organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @returns {Object} type, status, statusText, id, sshUrl, WebUrl
 */

async function createRepo({ organization, project, appName, pat }) {
  try {
    const res = await axios({
      method: 'POST',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=6.1-preview.1`,
      data: {
        name: appName,
      },
      auth: {
        username: '',
        password: pat,
      },
    });

    const response = {
      type: 'repository',
      status: res.status,
      statusText: res.statusText,
      id: res.data.id,
      name: res.data.name,
      sshUrl: res.data.sshUrl,
      webUrl: res.data.webUrl,
    };

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = createRepo;
