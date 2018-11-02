import { mergeAll, map, applyTo } from 'ramda'
import actLoaders from 'service/act/loaders'
import meditationLoaders from 'service/meditation/loaders'

const allLoaders = mergeAll([
  {},
  actLoaders,
  meditationLoaders,
])

export default (db) => {
  const applyToDict = map(applyTo(db))
  return applyToDict(allLoaders)
}
