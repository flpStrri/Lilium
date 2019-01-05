import { mergeAll } from 'ramda'
import authenticationDirective from 'application/authentication/directives'

export default mergeAll([
  {},
  { auth: authenticationDirective },
])
