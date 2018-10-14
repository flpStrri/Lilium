import { mergeAll } from 'ramda'
import actMutations from 'domain/application/act/mutations'
import meditationMutations from 'domain/application/meditation/mutations'

export default mergeAll([
  {},
  meditationMutations,
  actMutations,
])
