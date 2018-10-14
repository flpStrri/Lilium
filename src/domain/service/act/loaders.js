import DataLoader from 'dataloader'

export default {
  createActLoader: actRepository =>
    new DataLoader(actsIds => actRepository.batchLoadByIds(actsIds)),
  createMeditationActsLoader: actRepository =>
    new DataLoader(meditationsIds => actRepository.batchLoadByMeditationsIds(meditationsIds)),
}
