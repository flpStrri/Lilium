import { mergeTypes } from 'merge-graphql-schemas'
import actSchema from 'application/act'
import meditationSchema from 'application/meditation'
import authenticationSchema from 'application/authentication'

export default mergeTypes(
  [
    actSchema,
    meditationSchema,
    authenticationSchema,
  ],
  { all: true },
)
