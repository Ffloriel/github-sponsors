'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var program = _interopDefault(require('commander'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var YAML = _interopDefault(require('yaml'));
var child_process = require('child_process');
var chalk = _interopDefault(require('chalk'));

// Copyright Joyent, Inc. and other Node contributors.

const FUNDING_FILENAME = 'FUNDING.yml';

// Parse the Funding.yml and return the content
const parseFundingFile = async () => {
  let isFileExist = false;
  const pathToFile = `${process.cwd()}/.github/${FUNDING_FILENAME}`;
  try {
    isFileExist = await fs.promises.access(pathToFile, fs__default.constants.R_OK);
  } catch(e) {
    throw new Error('FUNDING.yml file not found')
  }

  const fileContent = await fs.promises.readFile(pathToFile, "utf-8");
  const yamlDoc = YAML.parse(fileContent);
  return yamlDoc
};

var name = "github-sponsors";
var version = "1.0.0";
var description = "Prompt your users to donate after `npm install`";
var main = "./lib/github-sponsors.js";
var module$1 = "./lib/github-sponsors.es.js";
var bin = "./bin/github-sponsors.js";
var scripts = {
	test: "jest",
	dev: "rollup -c rollup.config.js -w",
	build: "rollup -c rollup.config.js",
	prettier: "prettier --no-config",
	lint: "eslint",
	justatest: "./bin/github-sponsors.js"
};
var repository = {
	type: "git",
	url: "git+https://github.com/Ffloriel/github-sponsors.git"
};
var keywords = [
	"github",
	"sponsors",
	"opencollective",
	"community",
	"bridge",
	"ko-fi",
	"tidelift",
	"donate",
	"donation",
	"fundoss",
	"npm"
];
var author = "Ffloriel";
var license = "MIT";
var bugs = {
	url: "https://github.com/Ffloriel/github-sponsors/issues"
};
var homepage = "https://github.com/Ffloriel/github-sponsors#readme";
var devDependencies = {
	eslint: "^5.16.0",
	jest: "^24.8.0",
	prettier: "^1.17.1",
	rollup: "^1.12.3",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-node-builtins": "^2.1.2",
	"rollup-plugin-node-resolve": "^5.0.0"
};
var dependencies = {
	chalk: "^2.4.2",
	commander: "^2.20.0",
	yaml: "^1.6.0"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module$1,
	"jsnext:main": "./lib/github-sponsors.es.js",
	bin: bin,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies
};

// from nuxt/opencollective

const retrieveCols = (() => {
  let result = false;

  return () => {
    if (result) {
      return result
    }
    const defaultCols = 80;
    try {
      const terminalCols = child_process.execSync(`tput cols`, { stdio: ['pipe', 'pipe', 'ignore'] });
      result = parseInt(terminalCols.toString()) || defaultCols;
    } catch (e) {
      result = defaultCols;
    }
    return result
  }
})();

const print = (color = null) => (str = '') => {
  const terminalCols = retrieveCols();
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g, '').length;
  const leftPaddingLength = Math.floor((terminalCols - strLength) / 2);
  const leftPadding = ' '.repeat(Math.max(leftPaddingLength, 0));
  if (color) {
    str = chalk[color](str);
  }

  console.log(leftPadding, str);
};

const printDonationMessage = (fundingConfig, thanksMessage, donateMessage) => {
  const dim = print('dim');
  const yellow = print('yellow');
  const emptyLine = print();

  yellow(thanksMessage || `Thanks for installing ${packageJson.name} `);
  dim(donateMessage || `Please consider donating to help us maintain this package.`);
  emptyLine();
  emptyLine();
  for (const [platform, value] of Object.entries(fundingConfig)) {
    switch (platform) {
      case "github":
        printGithub(value);
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
          const [platformName, packageName] = value.split('/');
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
  
  emptyLine();
};

const printGithub = githubUsers => {
  print()(chalk.bold("Github"));
  if (typeof githubUsers === "string") {
    githubUsers = [githubUsers];
  }
  githubUsers.forEach(user => {
    const link = `https://github.com/users/${user}/sponsorship`;
    print()(`${user}: ${chalk.underline(link)}`);
  });
};

program
  .version('1.0.0')
  .option('-t, --thanks-message', 'Add a thank you message')
  .option('-d, --donate-message', 'Add a donate message')
  .option('-h, --hide', 'Hide the message')
  .parse(process.argv);

async function init() {
  try {
    const fundingConfig = await parseFundingFile();
    printDonationMessage(fundingConfig, program.thanksMessage, program.donateMessage);
  } catch (e) {
    console.error(e);
  }
}

init().then().catch(console.err);
