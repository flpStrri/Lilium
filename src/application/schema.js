import { mergeTypes } from 'merge-graphql-schemas'
import actSchema from 'domain/application/act'
import meditationSchema from 'domain/application/meditation'

export default mergeTypes(
  [
    actSchema,
    meditationSchema,
  ],
  { all: true },
)
