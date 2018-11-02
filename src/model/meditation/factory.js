import casual from 'casual'
import factoryFactory from 'factoryFactory'
import Meditation from 'model/meditation'

const meditation = ({
  id, name, category, shortDescription,
}) => new Meditation({
  _id: id || casual.uuid,
  name: name || casual.word,
  category: category || casual.random_element(['morning', 'evening', 'night']),
  shortDescription: shortDescription || casual.sentence,
})

export default factoryFactory(meditation)
