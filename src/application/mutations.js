import { mergeAll } from 'ramda'
import actMutations from 'application/act/mutations'
import meditationMutations from 'application/meditation/mutations'
import authenticationMutations from 'application/authentication/mutations'

export default mergeAll([
  {},
  meditationMutations,
  actMutations,
  authenticationMutations,
])
