export default {
  id(act) {
    return act._id
  },
  meditation(act, _, context) {
    return context.loaders.meditationLoader.load(act.meditationId)
  },
}
