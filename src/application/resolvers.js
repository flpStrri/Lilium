import { mergeAll } from 'ramda'
import actResolvers from 'domain/application/act/resolvers'
import meditationResolvers from 'domain/application/meditation/resolvers'

export default mergeAll([
  {},
  meditationResolvers,
  actResolvers,
])
