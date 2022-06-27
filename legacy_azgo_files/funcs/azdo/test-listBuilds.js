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
  buildNumber: 263853,
};

async function getBuild({ appName, organization, project, pat }) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/build/builds?api-version=7.1-preview.7&buildNumber=${buildNumber}`,
      // 263853
      // GET https://dev.azure.com/{organization}/{project}/_apis/build/builds?definitions={definitions}&queues={queues}&buildNumber={buildNumber}&minTime={minTime}&maxTime={maxTime}&requestedFor={requestedFor}&reasonFilter={reasonFilter}&statusFilter={statusFilter}&resultFilter={resultFilter}&tagFilters={tagFilters}&properties={properties}&$top={$top}&continuationToken={continuationToken}&maxBuildsPerDefinition={maxBuildsPerDefinition}&deletedFilter={deletedFilter}&queryOrder={queryOrder}&branchName={branchName}&buildIds={buildIds}&repositoryId={repositoryId}&repositoryType={repositoryType}&api-version=7.1-preview.7
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

getBuild(opts);
