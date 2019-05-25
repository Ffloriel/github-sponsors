module.exports = {
  title: 'GitHub Sponsors (npm)',
  description: 'Prompt your users to donate after `npm install`',
  base: '/github-sponsors/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/Guide.md'},
      { 
        text: 'Funding Model Platforms',
        items: [
          { text: 'GitHub', link: '/funding-model-platforms/Github.md'},
          { text: 'Patreon', link: '/funding-model-platforms/Patreon.md'},
          { text: 'Open Collective', link: '/funding-model-platforms/Open_Collective.md'},
          { text: 'Tidelift', link: '/funding-model-platforms/Tidelift.md'},
          { text: 'Ko-Fi', link: '/funding-model-platforms/Ko_Fi.md'},
          { text: 'Custom', link: '/funding-model-platforms/Custom.md'}
        ]
      },
      { text: 'GitHub Sponsors', link: 'https://github.com/sponsors'}
    ],
    sidebar: 'auto',
    // Assumes GitHub. Can also be a full GitLab url.
    repo: 'Ffloriel/github-sponsors',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Help us improve this page!'
  }
}