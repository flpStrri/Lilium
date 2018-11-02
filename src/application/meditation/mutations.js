import MeditationService from 'service/meditation'

export default {
  createMeditation: (_, args, context) => {
    const meditationService = MeditationService.build(context.db, context.loaders)
    return meditationService.create(args.input)
  },
  deleteMeditation: (_, args, context) => {
    const meditationService = MeditationService.build(context.db, context.loaders)
    return meditationService.delete(args.id)
  },
  updateMeditation: (_, args, context) => {
    const meditationService = MeditationService.build(context.db, context.loaders)
    return meditationService.update(args.input)
  },
}
