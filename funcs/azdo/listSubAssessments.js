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
//  const pat = require('../vars.json').pat;
// const opts = {
//   pat: require('../vars.json').pat,
//   organization: '',
//   project: '',
//   appName: 'blank',
// };

const opts = {
  subscriptionId: '',
};

__name__(opts);

async function __name__({ appName, organization, project, pat }) {
  try {
    const res = await axios({
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ',
      },
      url: `https://management.azure.com/${subscriptionId}/providers/Microsoft.Security/assessments/${assessmentName}/subAssessments?api-version=2019-01-01-preview`,
      auth: {
        username: '',
        password: pat,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = __name__;
