/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */

// const os = require('os')
import { homedir } from 'os'

// const inquirer = require('inquirer');
import inquirer from 'inquirer'
// const inquirer = await import('inquirer')
// const differenceInDays = require('date-fns/differenceInDays')

// const { readFileSync, writeFileSync } = require('fs')
import { readFileSync, writeFileSync } from 'fs'

// const { dim, green } = require('chalk')
import chalk from 'chalk'

const azureProfilePath = `${homedir()}/.azure/azureProfile.json`
const { installationId, subscriptions } = JSON.parse(readFileSync(azureProfilePath).toString().trim())

export default async function selectActiveSubscription() {
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
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "changeActiveSub",
    message: `${chalk.dim(
      `${chalk.bold('Current active subscription')}
      ID: ${currentActive.id}
      Name: ${currentActive.name}
      Username: ${currentActive.user.name}`
    )}
    Are you sure you want to change active subscription?`,
    default: false,
  })

  if (answer.changeActiveSub) {
    const newSubAnswer = await inquirer.prompt({
      type: "list",
      name: "subscriptionId",
      message: "Choose subscription",
      choices: subs,
    })
    const newSubList = subscriptions.map((sub) => {
      if (sub.id == newSubAnswer.subscriptionId.subscriptionId) {
        sub.isDefault = true
      } else {
        sub.isDefault = false
      }
      return sub
    })
    const newAzCliProfile = { installationId, subscriptions: newSubList }
    writeFileSync(azureProfilePath, JSON.stringify(newAzCliProfile))
    console.log(
      chalk.green(
        `Active subscription changed to ${newSubAnswer.subscriptionId.subscriptionId} - ${newSubAnswer.subscriptionId.name} - ${newSubAnswer.subscriptionId.user}`
      )
    )
    return newAzCliProfile
  } else {
    return false
  }
}
