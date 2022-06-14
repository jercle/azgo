/**
 * Lists all files in a File Share within a given Storage Account
 *
 * @param {string} connStr - Connection string obtained from Azure Portal storage account
 * @param {string} shareName - Name of the File Share to display files from
 * @param {string} path - Path within the directory, leave blank for root
 * @returns Nothings is returned
 */

const { ShareServiceClient } = require('@azure/storage-file-share');

async function listShareFiles({ connStr, shareName, path }) {
  const serviceClient = ShareServiceClient.fromConnectionString(connStr);

  const directoryClient = await serviceClient
    .getShareClient(shareName)
    .getDirectoryClient('');

  let dirIter = await directoryClient.listFilesAndDirectories();

  let files = [];

  for await (const item of dirIter) {
    if (item.kind === 'directory') {
      console.log(`${i} - directory\t: ${item.name}`);
    } else {
      let file = await directoryClient.getFileClient(item.name).getProperties();
      files = [
        ...files,
        {
          name: item.name,
          lastModified: file.lastModified,
        },
      ];
    }
  }
  console.log(JSON.stringify(files, null, 2));
}

module.exports = listShareFiles;
