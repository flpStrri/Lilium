workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Test" {
  uses = "nodejs/docker-node/node:8"
  runs = "yarn install"
}
