const axios = require('axios').default;

/**
 * Description: Returns all Securiy Namespaces in a given org
 *
 * @param {Object} config - Configuration object including organization and Personal Access Token
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @return
 */
 async function getSecurityNamespaces({ organization, pat }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/_apis/securitynamespaces?api-version=6.0`,
      auth: {
        username: '',
        password: pat,
      },
    });
    return response.data.value
} catch (err) {
  console.log(err)
  return err
  }
}



module.exports = getSecurityNamespaces;
