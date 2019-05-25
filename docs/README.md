---
home: true
heroImage: https://github.githubassets.com/images/modules/site/sponsors/logo-mona.svg
actionText: Get Started →
actionLink: /Guide.html
features:
- title: Simple
  details: Minimal setup, one line of code in npm script postinstall.
- title: Be visible
  details: Let your users know you are accepting sponsors.
- title: Learn about open source funding
  details: Take a look on the website to learn about the different funding model platforms
footer: MIT Licensed
---

## A simple npm package

GitHub Sponsors has been announced during Github Satellite at Berlin May 23rd. It is a new way for open source developers to collect donation from the community.
A few ways to do that already exists, but GitHub Sponsors is taking responsibility in this area by adding this feature directly on GitHub.
You can add a Sponsor button on the top of your projects and it will open a popup window containing links to the donation pages.

This package allows open source maintainers to print a post-install message easily for their packages. `github-sponsors` is using `FUNDING.yml` to retrieve the information and displaying it to the user.

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
