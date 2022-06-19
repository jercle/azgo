/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */

const os = require("os")
const azCliProfile = require(`${os.homedir()}/.azure/azureProfile.json`)

export default function listSubscriptions() {
  const formattedProfile = azCliProfile.subscriptions.reduce(
    (all, item, index) => {
      if (!all[item.tenantId]) {
        all[item.tenantId] = []
      }
      all[item.tenantId] = [
        ...all[item.tenantId],
        {
          subscriptionId: item.id,
          subscriptionName: item.name,
          username: item.user.name,
          isDefault: item.isDefault,
        },
      ]
      return all
    },
    {}
  )
  // console.log()
  return formattedProfile
}

// module.exports = listSubscriptions
