import * as axios from 'axios'
// import chalk from 'chalk'
// import { readFileSync, writeFileSync } from 'fs';
// import { stripHtml } from '../funcs/azgoUtils.js'

const pat = process.env.AZURE_DEVOPS_EXT_PAT

type multiOptions = {
  user: any;
  organization: any;
  id: string;
  list: boolean;
  onlyCount: boolean;
  groupBy: string;
  filterType: string;
  filterState: string;
  open: boolean;
  closed: boolean;
  all: boolean;
}

const organization = 'ipagov'
const project = 'azure-terraform'

export async function listADORepositories(organization: string, project: string) {
  const { data } = await axios.default({
    method: "GET",
    url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0ttps://dev.azure.com/${organization}/_apis/wit/workitems/${id}?api-version=7.1-preview.3`,
    auth: {
      username: "",
      password: pat,
    },
  })
  return data
}
// GET
