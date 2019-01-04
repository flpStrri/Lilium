workflow "Continuous Integration and Deployment" {
  on = "push"
  resolves = ["Clean"]
}

action "Setup" {
  uses = "docker://node:10"
  runs = "make"
  args = "setup"
}

action "Test" {
  uses = "docker://node:10"
  needs = "Setup"
  runs = "make"
  args = "test"
}

action "Clean" {
  uses = "docker://node:10"
  needs = "Test"
  runs = "make"
  args = "clean"
}