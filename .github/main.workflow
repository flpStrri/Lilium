workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Build" {
  uses = "docker://node:10"
  runs = "make"
  args = "build"
}

action "Test" {
  uses = "docker://node:10"
  needs = "Build"
  runs = "make"
  args = "test"
}
