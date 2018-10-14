import casual from 'casual'
import factoryFactory from 'infrastructure/factoryFactory'
import Act from 'domain/model/act'

casual.define('act', (
  _id, title, shortDescription, meditationId,
  index, textBody, audioTrackUrl, videoTrackUrl) => new Act({
  _id: _id || casual.uuid,
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  meditationId: meditationId || casual.uuid,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
}))

export default factoryFactory(casual.act)