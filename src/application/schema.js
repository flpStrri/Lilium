import { mergeTypes } from 'merge-graphql-schemas'
import actSchema from 'application/act'
import meditationSchema from 'application/meditation'

export default mergeTypes(
  [
    actSchema,
    meditationSchema,
  ],
  { all: true },
)
