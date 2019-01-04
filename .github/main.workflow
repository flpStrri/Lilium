workflow "Continuous Integration and Deployment" {
  on = "push"
  resolves = ["Clean"]
}

action "Setup" {
  uses = "./.github/make-action"
  runs = "make"
  args = "setup"
}

action "Test" {
  uses = "./.github/make-action"
  needs = "Setup"
  runs = "make"
  args = "test"
}

action "Clean" {
  uses = "./.github/make-action"
  needs = "Test"
  runs = "make"
  args = "clean"
}