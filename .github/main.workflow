workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Build" {
  uses = "./.github/make-action"
  args = "build"
}

action "Test" {
  uses = "./.github/make-action"
  needs = "Build"
  args = "test"
}
