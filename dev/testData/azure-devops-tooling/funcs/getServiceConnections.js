/**
 * Description
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.appName - Name of the repository being searched
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.project - Name of project Team should be within
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @return
 */

const axios = require('axios').default;
//////////////////// For testing ///////////////////////////////////////
getServiceConnections(require('../vars.json').env).then(
  (data) => console.log(JSON.stringify(data, null, 2))
  // writeFileSync('../getServiceConnectionsResult.json', JSON.stringify(data))
);
////////////////////////////////////////////////////////////////////////

async function getServiceConnections({ appName, organization, project, pat }) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/serviceendpoint/endpoints?api-version=7.1-preview.4`,
      auth: {
        username: '',
        password: pat,
      },
      proxy: false,
    });

    let results = res.data.value
      .filter((item) => item.name.toLowerCase().includes(appName.toLowerCase()))
      .map((item) => {
        let projectRef =
          item.serviceEndpointProjectReferences[0].projectReference.name;

        return {
          id: item.id,
          name: item.name,
          environment: item.data.subscriptionName,
          project: projectRef,
        };
      });
    return results;
  } catch (err) {
    return err;
  }
}

module.exports = getServiceConnections;
