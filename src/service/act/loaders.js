import DataLoader from 'dataloader'
import ActService from 'service/act'

export default {
  actLoader: db =>
    new DataLoader((actsIds) => {
      const actService = ActService.build(db)
      return actService.loadByIds(actsIds)
    }),
  meditationActsLoader: db =>
    new DataLoader((meditationsIds) => {
      const actService = ActService.build(db)
      return actService.loadByMeditationsIds(meditationsIds)
    }),
}
