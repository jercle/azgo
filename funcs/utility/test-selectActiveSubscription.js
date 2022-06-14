/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */

const os = require("os")
const inquirer = require("inquirer")
const { writeFileSync } = require("fs")
const { dim, green } = require("chalk")

const azureProfilePath = `${os.homedir()}/.azure/azureProfile.json`
const { installationId, subscriptions } = require(azureProfilePath)

function selectActiveSubscription() {

  const currentActive = subscriptions.filter((sub) => sub.isDefault)[0]

  const subs = subscriptions.map((sub) => ({
    value: {
      subscriptionId: sub.id,
      name: sub.name,
      user: sub.user.name,
      tenantId: sub.tenantId,
    },
    name: `${sub.id} __ ${sub.name} __ ${sub.user.name}`,
    user: sub.user.name,
    tenantId: sub.tenantId,
  }))

  inquirer
    .prompt({
      type: "confirm",
      name: "changeActiveSub",
      message: `Are you sure you want to change active subscription?

    ${dim(
      `Current active subscription is: ${currentActive.id} - ${currentActive.name} - ${currentActive.user.name}`
    )}
    `,
      default: false,
    })
    .then((answer) => {
      if (answer.changeActiveSub) {
        inquirer
          .prompt({
            type: "list",
            name: "subscriptionId",
            message: "Choose subscription",
            choices: subs,
          })
          .then((answer) => {
            const newSubList = subscriptions.map((sub) => {
              if (sub.id == answer.subscriptionId.subscriptionId) {
                sub.isDefault = true
              } else {
                sub.isDefault = false
              }
              return sub
            })
            writeFileSync(
              azureProfilePath,
              JSON.stringify({ installationId, subscriptions: newSubList })
            )
            console.log(
              green(
                `Active subscription changed to ${answer.subscriptionId.subscriptionId} - ${answer.subscriptionId.name} - ${answer.subscriptionId.user}`
              )
            )
          })
      }
    })
}

module.exports = selectActiveSubscription
