const { SecretClient } = require("@azure/keyvault-secrets")

/**
 * Lists all secrets and last updated time for a given App's Environment
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @returns Nothingsis returned
 */
async function getSecrets({ appEnv, appName }, azCliCredential) {
  const env = () => {
    switch (appEnv) {
      case "dev":
        return "nonprod-d"
        break
      case "test":
        return "nonprod-t"
        break
      case "prod":
        return "prod"
        break
    }
  }

  const keyVaultUrl = `https://dmz-${env()}-${appName}-kv.vault.azure.net/`
  const client = new SecretClient(keyVaultUrl, azCliCredential)

  let secrets = []
  for await (const secretProperties of client.listPropertiesOfSecrets()) {
    const secret = await client.getSecret(secretProperties.name)

    secrets = [
      ...secrets,
      {
        secretName: secret.name,
        createdOn: secret.properties.createdOn,
        updatedOn: secret.properties.updatedOn,
        id: secret.properties.id,
      },
    ]
  }
  console.log(JSON.stringify(secrets, null, 2))
}

module.exports = getSecrets
