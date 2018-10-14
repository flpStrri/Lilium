import { attributes } from 'structure'
import uuid from 'uuid/v4'

export default attributes({
  _id: { type: String, required: true, default: uuid },
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    equal: ['morning', 'evening', 'night'],
  },
  shortDescription: { type: String },
})(class Meditation {})
