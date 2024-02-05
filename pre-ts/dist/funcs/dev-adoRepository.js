import * as axios from 'axios';
// import chalk from 'chalk'
// import { readFileSync, writeFileSync } from 'fs';
// import { stripHtml } from '../funcs/azgoUtils.js'
const pat = process.env.AZURE_DEVOPS_EXT_PAT;
const organization = 'ipagov';
const project = 'azure-terraform';
export async function listADORepositories(organization, project) {
    const { data } = await axios.default({
        method: "GET",
        url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0`,
        auth: {
            username: "",
            password: pat,
        },
    });
    return data;
}
// GET
