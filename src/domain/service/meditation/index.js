import { ApolloError } from 'apollo-server'
import { indexBy, prop } from 'ramda'
import MeditationRepository from 'domain/model/meditation/repository'
import ActRepository from 'domain/model/act/repository'
import { createDomainInputError } from 'infrastructure/domainFunctions'
import Meditation from 'domain/model/meditation'
import Act from 'domain/model/act'

export default class MeditationService {
  constructor(meditationRepository, actRepository, loaders) {
    this.meditationRepository = meditationRepository
    this.actRepository = actRepository
    this.loaders = loaders
  }

  static build(db, loaders) {
    return new MeditationService(
      new MeditationRepository(db),
      new ActRepository(db),
      loaders,
    )
  }

  async create(createInput) {
    const meditation = new Meditation(createInput)
    const acts = createInput.acts.map(act => new Act({
      ...act, meditationId: meditation._id,
    }))
    const meditationValidation = meditation.validate()
    const actsValidations = acts.map(act => act.validate())
    if (!meditationValidation.valid) {
      throw createDomainInputError(meditationValidation.errors)
    }
    actsValidations.map((actValidation) => {
      if (!actValidation.valid) {
        throw createDomainInputError(actValidation.errors)
      } return true
    })
    const addedMeditation = await this.meditationRepository.add(meditation)
    const addedActs = await this.actRepository.addMany(acts)
    this.loaders.meditationLoader.clear(addedMeditation._id)
    addedActs
      .map(act => this.loaders.actLoader.clear(act._id))
    this.loaders.meditationActsLoader.clear(addedMeditation._id)

    return { ...meditation.toJSON(), acts: addedActs.map(act => act.toJSON()) }
  }

  async loadFromFilter(filterInput) {
    const loadedMeditations = await this.meditationRepository.loadFromFilter(filterInput)
    return loadedMeditations
  }

  batchLoadByIds(ids) {
    const loadedMeditations = this.meditationRepository.loadByIds(ids)
    return loadedMeditations
      .then((meditations) => {
        const meditationsById = indexBy(prop('_id'), meditations)
        return ids.map(meditationsId => meditationsById[meditationsId])
      })
  }

  async update(updateInput) {
    const { id, ...propertiesToUpdate } = updateInput
    const meditation = await this.meditationRepository.load(id)

    for (const propertyKey of Object.keys(propertiesToUpdate)) { // eslint-disable-line no-restricted-syntax
      meditation[propertyKey] = propertiesToUpdate[propertyKey]
    }

    const meditationValidation = meditation.validate()
    if (meditationValidation.valid) {
      const replacedMeditation = await this.meditationRepository.replace(meditation)
      this.loaders.meditationLoader.clear(replacedMeditation._id)
      return replacedMeditation.toJSON()
    } else {
      throw createDomainInputError(meditationValidation.errors)
    }
  }

  async delete(id) {
    const meditation = await this.meditationRepository.load(id)
    if (meditation) {
      await this.meditationRepository.delete(id)
      const meditationActs = await this.actRepository.loadByMeditationId(meditation._id)
      await this.actRepository.deleteMany(meditationActs.map(act => act._id))
      this.loaders.meditationLoader.clear(id)
      meditationActs.map(act => this.loaders.actLoader.clear(act._id))
      this.loaders.meditationActsLoader.clear(id)
    } else {
      throw new ApolloError('Meditation not found', 'NOT_FOUND')
    }
  }
}
