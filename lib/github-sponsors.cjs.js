'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var program = _interopDefault(require('commander'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var YAML = _interopDefault(require('yaml'));
var child_process = require('child_process');
var chalk = _interopDefault(require('chalk'));

// Copyright Joyent, Inc. and other Node contributors.

const FUNDING_FILENAME = "FUNDING.yml";

// Parse the FUNDING.yml and return the content
const parseFundingFile = async () => {
  let isFileExist = false;
  const pathToFile = `${process.cwd()}/.github/${FUNDING_FILENAME}`;
  try {
    isFileExist = await fs.promises.access(pathToFile, fs__default.constants.R_OK);
  } catch (e) {
    throw new Error("FUNDING.yml file not found");
  }

  const fileContent = await fs.promises.readFile(pathToFile, "utf-8");
  const yamlDoc = YAML.parse(fileContent);
  return yamlDoc;
};

var name = "github-sponsors";
var version = "1.0.1";
var description = "Prompt your users to donate after `npm install`";
var main = "./lib/github-sponsors.js";
var module$1 = "./lib/github-sponsors.es.js";
var bin = "./bin/github-sponsors.js";
var directories = {
	lib: "lib",
	test: "__tests__"
};
var scripts = {
	test: "jest",
	dev: "rollup -c rollup.config.js -w",
	build: "rollup -c rollup.config.js",
	prettier: "prettier --no-config --write '{src,__{tests,mocks}__}/**/*.js'",
	lint: "eslint",
	justatest: "./bin/github-sponsors.js",
	"docs:dev": "vuepress dev docs",
	"docs:build": "vuepress build docs"
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
var engines = {
	node: ">=8.0.0",
	npm: ">=5.2.0"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module$1,
	"jsnext:main": "./lib/github-sponsors.es.js",
	bin: bin,
	directories: directories,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies,
	engines: engines
};

// from nuxt/opencollective

const retrieveCols = (() => {
  let result = false;

  return () => {
    if (result) {
      return result;
    }
    const defaultCols = 80;
    try {
      const terminalCols = child_process.execSync(`tput cols`, {
        stdio: ["pipe", "pipe", "ignore"]
      });
      result = parseInt(terminalCols.toString()) || defaultCols;
    } catch (e) {
      result = defaultCols;
    }
    return result;
  };
})();

const print = (color = null) => (str = "") => {
  const terminalCols = retrieveCols();
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g, "").length;
  const leftPaddingLength = Math.floor((terminalCols - strLength) / 2);
  const leftPadding = " ".repeat(Math.max(leftPaddingLength, 0));
  if (color) {
    str = chalk[color](str);
  }

  console.log(leftPadding, str);
};

const DEFAULT_THANKS_MESSAGE = `Thanks for installing ${packageJson.name}`;
const DEFAULT_DONATE_MESSAGE =
  "Please consider donating to help us maintain this package.";

const printDonationMessage = (
  fundingConfig,
  thanksMessage = DEFAULT_THANKS_MESSAGE,
  donateMessage = DEFAULT_DONATE_MESSAGE
) => {
  const dim = print("dim");
  const yellow = print("yellow");
  const emptyLine = print();

  yellow(thanksMessage);
  dim(donateMessage);
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

const shouldHideMessage = (env = process.env) => {
  // Show message if it is forced
  if (env.GITHUB_SPONSORS_FORCE) {
    return false;
  }

  // Don't show after oracle postinstall
  if (env.OC_POSTINSTALL_TEST) {
    return true;
  }

  // Don't show if on CI
  if (env.CI || env.CONTINUOUS_INTEGRATION) {
    return true;
  }

  // Only show in dev environment
  return (
    Boolean(env.NODE_ENV) && !["dev", "development"].includes(env.NODE_ENV)
  );
};

program
  .version("1.0.0")
  .option("-t, --thanks-message", "Add a thank you message")
  .option("-d, --donate-message", "Add a donate message")
  .option("-h, --hide", "Hide the message")
  .parse(process.argv);

async function init(path = ".") {
  if (program.hide || shouldHideMessage(process.env)) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(
      fundingConfig,
      program.thanksMessage,
      program.donateMessage
    );
  } catch (e) {
    console.error(e);
  }
}

exports.init = init;
