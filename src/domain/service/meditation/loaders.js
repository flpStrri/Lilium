import DataLoader from 'dataloader'

export default {
  createMeditationLoader: meditationRepository =>
    new DataLoader(meditationsIds => meditationRepository.batchLoadByIds(meditationsIds)),
}
