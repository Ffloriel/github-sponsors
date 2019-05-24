import { execSync } from 'child_process'
import chalk from 'chalk';
import packageJson from './../../package.json';

// from nuxt/opencollective

export const retrieveCols = (() => {
  let result = false

  return () => {
    if (result) {
      return result
    }
    const defaultCols = 80
    try {
      const terminalCols = execSync(`tput cols`, { stdio: ['pipe', 'pipe', 'ignore'] })
      result = parseInt(terminalCols.toString()) || defaultCols
    } catch (e) {
      result = defaultCols
    }
    return result
  }
})()

export const print = (color = null) => (str = '') => {
  const terminalCols = retrieveCols()
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g, '').length
  const leftPaddingLength = Math.floor((terminalCols - strLength) / 2)
  const leftPadding = ' '.repeat(Math.max(leftPaddingLength, 0))
  if (color) {
    str = chalk[color](str)
  }

  console.log(leftPadding, str)
}

const DEFAULT_THANKS_MESSAGE = ``;
const DEFAULT_DONATE_MESSAGE = ``;

export const printDonationMessage = (fundingConfig, thanksMessage, donateMessage) => {
  const dim = print('dim')
  const yellow = print('yellow')
  const emptyLine = print()

  yellow(thanksMessage || `Thanks for installing ${packageJson.name} `)
  dim(donateMessage || `Please consider donating to help us maintain this package.`)
  emptyLine()
  emptyLine()
  for (const [platform, value] of Object.entries(fundingConfig)) {
    switch (platform) {
      case "github":
        printGithub(value)
        break;
      case "patreon":
        print()(chalk.bold("Patreon"));
        break;
      case "open_collective":
          print()(chalk.bold("Open Collective"));
          print()(`${chalk.underline(`https://opencollective.com/${value}`)}`);
          break;
      case "ko_fi":
          print()(chalk.bold("Ko Fi"));
          print()(`${chalk.underline(`https://ko-fi.com/${value}`)}`);
        break;
      case "tidelift":
          const [platformName, packageName] = value.split('/')
          print()(chalk.bold("Tidelift"));
          print()(`${chalk.underline(`https://tidelift.com/subscription/pkg/${platformName}-${packageName}`)}`);
        break;
      case "custom":
          print()(chalk.bold("Sponsorship"));
          print()(`${chalk.underline(value)}`);
        break;
      default:
        break;
    }
    // print()(`${chalk.bold(`${key}`)}: ${chalk.underline(value)}`)
  }
  
  emptyLine()
}

export const printGithub = githubUsers => {
  print()(chalk.bold("Github"));
  if (typeof githubUsers === "string") {
    githubUsers = [githubUsers]
  }
  githubUsers.forEach(user => {
    const link = `https://github.com/users/${user}/sponsorship`
    print()(`${user}: ${chalk.underline(link)}`)
  })
}
