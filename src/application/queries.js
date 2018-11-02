import { mergeAll } from 'ramda'
import meditationQueries from 'application/meditation/queries'

export default mergeAll([
  {},
  meditationQueries,
])
