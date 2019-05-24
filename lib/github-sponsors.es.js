import fs from 'fs';
import { promisify } from 'util';
import YAML from 'yaml';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}
// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}
// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

const readFile = promisify(fs.readFile);
const access = promisify(fs.access);

const FUNDING_FILENAME = "FUNDING.yml";

// Parse the FUNDING.yml and return the content
const parseFundingFile = async (path = process.cwd()) => {
  let isFileExist = false;
  const pathToFile = `${path}/.github/${FUNDING_FILENAME}`;
  try {
    isFileExist = await access(pathToFile, fs.constants.R_OK);
  } catch (e) {
    throw new Error("FUNDING.yml file not found");
  }

  const fileContent = await readFile(pathToFile, "utf-8");
  const yamlDoc = YAML.parse(fileContent);
  return yamlDoc;
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

const printDonationMessage = (
  fundingConfig,
  pkgPath
) => {
  const packageJson = require(path.resolve(pkgPath) + '/package.json');
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

const printGithub = githubUsers => {
  print()(chalk.bold("GitHub"));
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

async function init(path = process.cwd(), hideMessage = shouldHideMessage()) {
  if (hideMessage) return;
  try {
    const fundingConfig = await parseFundingFile(path);
    printDonationMessage(
      fundingConfig,
      path
    );
  } catch (e) {
    console.error(e);
  }
}

export { init };
