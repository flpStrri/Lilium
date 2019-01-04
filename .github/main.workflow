workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Test" {
  uses = "nodejs/docker-node/8/jessie@master"
  runs = "yarn install"
}
