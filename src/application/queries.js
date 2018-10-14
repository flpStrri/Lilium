import { mergeAll } from 'ramda'
import meditationQueries from 'domain/application/meditation/queries'

export default mergeAll([
  {},
  meditationQueries,
])
