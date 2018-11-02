import DataLoader from 'dataloader'
import MeditationService from 'service/meditation'

export default {
  meditationLoader: db =>
    new DataLoader((meditationsIds) => {
      const meditationService = MeditationService.build(db)
      return meditationService.loadByIds(meditationsIds)
    }),
}
