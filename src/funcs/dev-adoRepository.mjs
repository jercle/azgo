import * as axios from "axios";
// import chalk from 'chalk'
import { readFileSync, writeFileSync } from "fs";
// import { stripHtml } from '../funcs/azgoUtils.js'

const pat = process.env.AZURE_DEVOPS_EXT_PAT;

const organization = "ipagov";
const project = "azure-terraform";

export async function listADORepositories(organization, project) {
  if (project) {
    const { data } = await axios.default({
      method: "GET",
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0`,
      auth: {
        username: "",
        password: pat,
      },
    });
    // console.log(data);
    return data;
  } else {
  }
  const { data } = await axios.default({
    method: "GET",
    url: `https://dev.azure.com/${organization}/_apis/git/repositories?api-version=7.0`,
    auth: {
      username: "",
      password: pat,
    },
  });
  // console.log(data);
  return data;
}
// GET

// await listADORepositories(organization, project)

export const getADOPullRequests = async (organization, project, repository) => {
  const { data } = await axios.default({
    method: "GET",
    url: `https://dev.azure.com/${organization}/_apis/git/pullrequests?searchCriteria.status=active&api-version=7.0`,
    auth: {
      username: "",
      password: pat,
    },
  });
  // console.log(JSON.stringify(data))
  // console.log(data);
  const formattedData = data.value.map((pr) => {
    return {
      repo: `${pr.repository.project.name}/${pr.repository.name}`,
      pullRequestId: pr.pullRequestId,
      title: pr.title,
      status: pr.status,
      createdBy: {
        displayName: pr.createdBy.displayName,
        email: pr.createdBy.uniqueName,
      },
      creationDate: pr.creationDate,
      sourceRefName: pr.sourceRefName,
      targetRefName: pr.targetRefName,
    };
  });
  // console.log(formattedData)

  // writeFileSync('/home/ec2-user/git/azgo/getAllPrs.json', JSON.stringify(data, null, 2))
  return formattedData;
};
// GET https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=7.0

await getADOPullRequests(organization, project, project);
// GET https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}/pullrequests?searchCriteria.creatorId={searchCriteria.creatorId}&searchCriteria.includeLinks={searchCriteria.includeLinks}&searchCriteria.repositoryId={searchCriteria.repositoryId}&searchCriteria.reviewerId={searchCriteria.reviewerId}&searchCriteria.sourceRefName={searchCriteria.sourceRefName}&searchCriteria.sourceRepositoryId={searchCriteria.sourceRepositoryId}&searchCriteria.status={searchCriteria.status}&searchCriteria.targetRefName={searchCriteria.targetRefName}&maxCommentLength={maxCommentLength}&$skip={$skip}&$top={$top}&api-version=7.0
