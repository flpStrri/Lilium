import casual from 'casual'
import factoryFactory from 'factoryFactory'

const createActInput = ({
  title, shortDescription, meditationId, index,
  textBody, audioTrackUrl, videoTrackUrl,
}) => ({
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  meditationId: meditationId || casual.uuid,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
})
export const createActInputFactory = factoryFactory(createActInput)

const updateActInput = ({
  id, title, shortDescription, index,
  textBody, audioTrackUrl, videoTrackUrl,
}) => ({
  id: id || casual.uuid,
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
})
export const updateActInputFactory = factoryFactory(updateActInput)
