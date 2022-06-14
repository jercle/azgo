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
const opts = {
  pat: require('../vars.json').env.pat,
  organization: '',
  project: '',
  appName: '',
  buildNumber: ,
};

getBuild(opts);

async function getBuild({ appName, organization, project, pat, buildNumber }) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/build/builds/${buildNumber}?api-version=7.1-preview.7`,
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
  console.log(pat);
}

module.exports = getBuild;
