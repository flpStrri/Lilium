import MeditationService from 'domain/service/meditation'

export default {
  meditations: (_, args, context) => {
    const meditationService = MeditationService.build(context.db, context.loaders)
    return meditationService.loadByFilter(args.input)
  },
}
