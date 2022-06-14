const axios = require('axios').default;

/**
 * Sets the policy on a repository's provided branch
 *
 * @param {Object} config - Configuration object
 * @param {string} config.organization - Azure DevOps Organization to run AsyncGeneratorFunctionConstructor
 * @param {string} config.project - Name of project to run against
 * @param {string} config.pat - Azure DevOps Personal Access Token
 * @param {string} config.defaultBranch Name of branch
 * @param {string} repoId GUID of repository, provided by Azure DevOps
 * @returns {Object} Object containing response from Azure DevOps - status, statusText, matchind, refName, displayName
 */
async function setBranchPolicy(
  { organization, project, pat, defaultBranch },
  repoId
) {
  const res = await axios({
    method: 'POST',
    url: `https://dev.azure.com/${organization}/${project}/_apis/policy/configurations/?api-version=5.1`,
    data: {
      isEnabled: true,
      isBlocking: false,
      type: {
        // Below id is the 'Minimum approval count' policy in Azure DevOps
        id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
      },
      settings: {
        minimumApproverCount: 1,
        creatorVoteCounts: false,
        blockLastPusherVote: true,
        requireVoteOnLastIteration: true,
        resetOnSourcePush: true,
        resetRejectionsOnSourcePush: true,
        scope: [
          {
            repositoryId: repoId,
            refName: `refs/heads/${defaultBranch}`,
            matchKind: 'exact',
          },
        ],
      },
    },
    auth: {
      username: '',
      password: pat,
    },
  });

  const response = {
    repoId,
    status: res.status,
    statusText: res.statusText,
    matchKind: res.data.settings.scope[0].matchKind,
    refName: res.data.settings.scope[0].refName,
    displayName: res.data.type.displayName,
  };

  return response;
}

module.exports = setBranchPolicy;
