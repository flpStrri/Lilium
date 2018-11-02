import { ApolloError } from 'apollo-server'
import { __, has, head, replace } from 'ramda'
import Meditation from 'model/meditation'

export default class MeditationRepository {
  constructor(db) {
    this.meditation_collection = db.collection(Meditation.name.toLowerCase())
  }

  async add(meditation) {
    const insertedDocument = await this.meditation_collection
      .insertOne(meditation.toJSON())
      .then(res => head(res.ops))
    return new Meditation(insertedDocument)
  }

  async load(id) {
    const loadedDocument = await this.meditation_collection
      .findOne({ _id: id })
    if (!loadedDocument) {
      throw new ApolloError('Meditation not found', 'NOT_FOUND')
    } else {
      return new Meditation(loadedDocument)
    }
  }

  loadByIds(ids) {
    return this.meditation_collection
      .find({ _id: { $in: ids } })
      .toArray()
  }

  async loadByFilter(filter) {
    const selectors = {}
    const filterInputHas = has(__, filter)
    const filterInjectioncharacters = replace(/function|var |\(|\)|{|}|=|<|>|;|:/g, '')

    if (filterInputHas('search')) {
      selectors.name = { $regex: filterInjectioncharacters(filter.search) }
    }
    if (filterInputHas('category')) {
      selectors.category = filterInjectioncharacters(filter.category)
    }
    const loadedMeditations = await this.meditation_collection
      .find(selectors)
      .toArray()
    return loadedMeditations.map(meditation => new Meditation(meditation))
  }

  async replace(meditation) {
    const replacedDocument = await this.meditation_collection
      .replaceOne({ _id: meditation._id }, meditation)
      .then((res) => {
        if (res.matchedCount !== 1) {
          throw new ApolloError('Meditation not found', 'NOT_FOUND')
        } else {
          return head(res.ops)
        }
      })
    return new Meditation(replacedDocument)
  }

  async delete(id) {
    await this.meditation_collection
      .deleteOne({ _id: id })
      .then((res) => {
        if (res.deletedCount !== 1) {
          throw new ApolloError('Meditation not found', 'NOT_FOUND')
        }
      })
  }
}
