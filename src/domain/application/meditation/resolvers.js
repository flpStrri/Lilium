export default {
  Meditation: {
    id(meditation) {
      return meditation._id
    },
    acts(meditation, _, context) {
      return context.loaders.meditationActsLoader.load(meditation._id)
    },
  },
}
