import { mergeAll } from 'ramda'
import actResolvers from 'application/act/resolvers'
import meditationResolvers from 'application/meditation/resolvers'

export default mergeAll([
  {},
  { Meditation: meditationResolvers },
  { Act: actResolvers },
])
