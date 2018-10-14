import { mergeAll } from 'ramda'
import actLoaders from 'domain/service/act/loaders'
import meditationLoaders from 'domain/service/meditation/loaders'

export default mergeAll([
  {},
  actLoaders,
  meditationLoaders,
])
