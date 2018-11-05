import { mergeAll } from 'ramda'
import authenticationDirectives from 'application/authentication/directives'

export default mergeAll([
  {},
  authenticationDirectives,
])
