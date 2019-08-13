# .github/main.workflow

# 触发: 当 push 时触发
workflow "Push" {
  on = "push"
  resolves = [
    "Release",
  ]
}

# 安装：仅当分支筛选通过时依赖安装
action "Installation" {
  needs = [
    "Filters for GitHub Actions",
  ]
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install npminstall -g && npminstall"
}

# # CI: 需先安装依赖
# action "CI" {
#   needs = "Installation"
#   uses = "thonatos/github-actions-nodejs@v0.1.1"
#   args = "npm run ci"
# }

# 发布：必须通过 CI
action "Release" {
  needs = "Installation"
  uses = "thonatos/github-actions-nodejs@v0.1.1"
  args = "npm run semantic-release "
  secrets = [
    "GITHUB_TOKEN",
    "NPM_TOKEN",
  ]
}

# 过滤：仅当 push 分支为 master 时通过
action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  secrets = ["GITHUB_TOKEN"]
  args = "branch master"
}

action "Filters for GitHub Actions-1" {
  uses = "actions/bin/filter@25b7b846d5027eac3315b50a8055ea675e2abd89"
  args = "branch develop"
  secrets = ["GITHUB_TOKEN"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Filters for GitHub Actions-1"]
  args = "install npminstall -g && npminstall"
}

action "thonatos/github-actions-nodejs@v0.1.1" {
  uses = "thonatos/github-actions-nodejs@v0.1.1"
  needs = ["GitHub Action for npm"]
  args = "npm run semantic-release"
  secrets = ["GITHUB_TOKEN", "NPM_TOKEN"]
} # .github/main.workflow

# # CI: 需先安装依赖
# action "CI" {
#   needs = "Installation"
#   uses = "thonatos/github-actions-nodejs@v0.1.1"
#   args = "npm run ci"
# }
