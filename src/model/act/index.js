import { attributes } from 'structure'
import { VALID_URL } from 'regex'
import uuid from 'uuid/v4'

export const COLLECTION_NAME = 'act'

export default attributes({
  _id: { type: String, required: true, default: uuid },
  title: { type: String, required: true },
  shortDescription: { type: String },
  meditationId: { type: String, required: true },
  index: {
    type: Number,
    integer: true,
    positive: true,
    required: true,
  },
  textBody: { type: String, required: true },
  audioTrackUrl: { type: String, regex: VALID_URL },
  videoTrackUrl: { type: String, regex: VALID_URL },
})(class Act {})
