import DataLoader from 'dataloader'
import ActService from 'domain/service/act'

export default {
  actLoader: db =>
    new DataLoader((actsIds) => {
      const actService = ActService.build(db)
      return actService.batchLoadByIds(actsIds)
    }),
  meditationActsLoader: db =>
    new DataLoader((meditationsIds) => {
      const actService = ActService.build(db)
      return actService.batchLoadByMeditationsIds(meditationsIds)
    }),
}
