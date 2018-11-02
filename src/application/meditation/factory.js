import casual from 'casual'
import factoryFactory from 'factoryFactory'

const createMeditationActInput = ({
  title, shortDescription, index, textBody, audioTrackUrl, videoTrackUrl,
}) => ({
  title: title || casual.word,
  shortDescription: shortDescription || casual.sentence,
  index: index || casual.integer(1, 15),
  textBody: textBody || casual.sentences(3),
  audioTrackUrl: audioTrackUrl || casual.url,
  videoTrackUrl: videoTrackUrl || casual.url,
})
export const createMeditationActInputFactory = factoryFactory(createMeditationActInput)

const createMeditationInput = ({
  name, category, shortDescription, acts,
}) => ({
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
  acts: acts || [createMeditationActInput({})],
})
export const createMeditationInputFactory = factoryFactory(createMeditationInput)

const updateMeditationInput = ({
  id, name, category, shortDescription,
}) => ({
  id: id || casual.uuid,
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
})
export const updateMeditationInputFactory = factoryFactory(updateMeditationInput)

const meditationsInputFilter = ({
  category, search,
}) => ({
  category: category || casual.random_element(['morning', 'evening', 'night']),
  search: search || casual.word,
})
export const meditationsInputFilterFactory = factoryFactory(meditationsInputFilter)
