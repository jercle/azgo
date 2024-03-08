import { execSync } from "child_process";
import { readFileSync } from "fs";

const jsonData = JSON.parse(readFileSync('la-tables.json'))
  // .filter(i => i.retentionInDaysAsDefault === false)
// az monitor log-analytics workspace table list --resource-group RES_GRP_NAME --workspace-name WORKSPACE_NAME
console.log(jsonData.length)


// jsonData.forEach(table => {
//   console.log(`Updating table: ${table.name}`)
//   const workspace = table.id.split('/workspaces/')[1].split('/')[0]
//   execSync(`az monitor log-analytics workspace table update --resource-group ${table.resourceGroup} \
//   --workspace-name ${workspace} -n ${table.name} --retention-time -1 --total-retention-time -1`)
// });
