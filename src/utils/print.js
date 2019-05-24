/* eslint-disable no-console */
/* eslint-disable no-control-regex */

import { execSync } from "child_process";
import chalk from "chalk";
import path from "path";

// from nuxt/opencollective

export const retrieveCols = (() => {
  let result = false;

  return () => {
    if (result) {
      return result;
    }
    const defaultCols = 80;
    try {
      const terminalCols = execSync(`tput cols`, {
        stdio: ["pipe", "pipe", "ignore"]
      });
      result = parseInt(terminalCols.toString()) || defaultCols;
    } catch (e) {
      result = defaultCols;
    }
    return result;
  };
})();

export const print = (color = null) => (str = "") => {
  const terminalCols = retrieveCols();
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g, "").length;
  const leftPaddingLength = Math.floor((terminalCols - strLength) / 2);
  const leftPadding = " ".repeat(Math.max(leftPaddingLength, 0));
  if (color) {
    str = chalk[color](str);
  }

  console.log(leftPadding, str);
};

export const printDonationMessage = (fundingConfig, pkgPath) => {
  const packageJson = require(path.resolve(pkgPath) + "/package.json");
  const dim = print("dim");
  const yellow = print("yellow");
  const emptyLine = print();

  yellow(`Thanks for installing ${packageJson.name}`);
  dim("Please consider donating to help us maintain this package.");
  emptyLine();
  emptyLine();
  for (const [platform, value] of Object.entries(fundingConfig)) {
    switch (platform) {
      case "github":
        printGithub(value);
        break;
      case "patreon":
        print()(chalk.bold("Patreon"));
        print()(`${chalk.underline(`https://patreon.com/${value}`)}`);
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
        print()(chalk.bold("Tidelift"));
        print()(
          `${chalk.underline(`https://tidelift.com/funding/github/${value}`)}`
        );
        break;
      case "custom":
        print()(chalk.bold("Sponsorship"));
        print()(`${chalk.underline(value)}`);
        break;
      default:
        break;
    }
  }

  emptyLine();
};

export const printGithub = githubUsers => {
  print()(chalk.bold("GitHub"));
  if (typeof githubUsers === "string") {
    githubUsers = [githubUsers];
  }
  githubUsers.forEach(user => {
    const link = `https://github.com/users/${user}/sponsorship`;
    print()(`${user}: ${chalk.underline(link)}`);
  });
};
