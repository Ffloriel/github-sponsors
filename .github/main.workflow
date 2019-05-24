workflow "Deploy on release" {
  on = "release"
  resolves = ["GitHub Action for npm"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "publish"
  env = {
    NPM_AUTH_TOKEN = "3e1f72b7-b643-4c7b-ba92-bc0c46ad5164"
  }
}

workflow "Build on push" {
  resolves = ["Lint"]
  on = "push"
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "install"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  runs = "run lint"
}
