import casual from 'casual'
import factoryFactory from '../../../infrastructure/factoryFactory'
import Meditation from 'domain/model/meditation'

casual.define('meditation', (_id, name, category, shortDescription) => new Meditation({
  _id: _id || casual.uuid,
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
}))

export default factoryFactory(casual.meditation)
