# Github Sponsors

[![Build Status](https://travis-ci.org/Ffloriel/github-sponsors.svg?branch=master)]()
[![CircleCi](https://circleci.com/gh/Ffloriel/github-sponsors/tree/master.svg?style=shield)]()
[![dependencies Status](https://david-dm.org/ffloriel/github-sponsors/status.svg)](https://david-dm.org/ffloriel/github-sponsors)
[![devDependencies Status](https://david-dm.org/ffloriel/github-sponsors/dev-status.svg)](https://david-dm.org/ffloriel/github-sponsors?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e89da576413e44b5943d504bb134edb5)](https://www.codacy.com/app/florielfedry/github-sponsors?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Ffloriel/github-sponsors&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/e89da576413e44b5943d504bb134edb5)](https://www.codacy.com/app/florielfedry/github-sponsors?utm_source=github.com&utm_medium=referral&utm_content=Ffloriel/github-sponsors&utm_campaign=Badge_Coverage)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/github-sponsors.svg)](https://www.npmjs.com/package/github-sponsors)
[![license](https://img.shields.io/github/license/ffloriel/github-sponsors.svg)]()
[![dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen.svg?style=plastic&logo=dependabot)]()

<p align="center">
	<img src="https://github.githubassets.com/images/modules/site/sponsors/logo-mona.svg" height="200" width="200" alt="Mona logo"/>
</p>

## What is Github Sponsors?

GitHub Sponsors has been announced during Github Satellite at Berlin May 23rd. It is a new way for open source developers to collect donation from the community.
A few ways to do that already exists, but GitHub Sponsors is taking responsibility in this area by adding this feature directly on GitHub.
You can add a Sponsor button on the top of your projects and it will open a popup window containing links to the donation pages.

This package allows open source maintainers to print a post-install message easily for their packages. `github-sponsors` is using `FUNDING.yml` to retrieve the information and displaying it to the user.


## Getting Started

### Installation

```
npm install --save github-sponsors
```

### Usage

Add in package.json:

```json
{
  "scripts": {
    "postinstall": "github-sponsors"
  }
}
```

## About GitHub Sponsors

- [Announcing GitHub Sponsors](https://github.blog/2019-05-23-announcing-github-sponsors-a-new-way-to-contribute-to-open-source/)
- [GitHub Sponsors](https://github.com/sponsors)
- [About GitHub Sponsors](https://help.github.com/en/articles/about-github-sponsors)
- [Sponsoring open source developers](https://help.github.com/en/articles/sponsoring-open-source-developers)
- [Receiving sponsorships as a sponsored developer](https://help.github.com/en/articles/receiving-sponsorships-as-a-sponsored-developer)
