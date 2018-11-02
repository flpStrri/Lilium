import casual from 'casual'
import factoryFactory from 'factoryFactory'
import Act from 'model/act'

const act = ({
  id, title, shortDescription, meditationId,
  index, textBody, audioTrackUrl, videoTrackUrl,
}) => new Act({
  _id: id || casual.uuid,
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  meditationId: meditationId || casual.uuid,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
})

export default factoryFactory(act)
