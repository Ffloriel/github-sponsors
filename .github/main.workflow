workflow "Publish " {
  resolves = ["Publish"]
  on = "release"
}

action "Publish" {
  needs = ["Tag"]
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  env = {
    NPM_AUTH_TOKEN = "3e1f72b7-b643-4c7b-ba92-bc0c46ad5164"
  }
  args = "publish"
}

workflow "Build, Lint, Test" {
  resolves = ["Test"]
  on = "push"
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Lint"]
  args = "run test"
}

action "Tag" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "tag"
}
