import casual from 'casual'
import factoryFactory from 'infrastructure/factoryFactory'

casual.define('createMeditationActInput', (title, shortDescription, index, textBody, audioTrackUrl, videoTrackUrl) => ({
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
}))
export const createMeditationActInputFactory = factoryFactory(casual.createMeditationActInput)

casual.define('createMeditationInput', (name, category, shortDescription, acts) => ({
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
  acts: acts || [casual.createMeditationActInput()],
}))
export const createMeditationInputFactory = factoryFactory(casual.createMeditationInput)

casual.define('updateMeditationInput', (_id, name, category, shortDescription) => ({
  id: _id || casual.uuid,
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
}))
export const updateMeditationInputFactory = factoryFactory(casual.updateMeditationInput)

casual.define('meditationsInputFilter', (category, search) => ({
  category: category || casual.random_element(['morning', 'evening', 'night']),
  search: search || casual.word,
}))
export const meditationsInputFilterFactory = factoryFactory(casual.meditationsInputFilter)
