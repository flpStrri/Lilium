import { ApolloError } from 'apollo-server'
import ActRepository from 'domain/model/act/repository'
import { createDomainInputError } from 'infrastructure/domainFunctions'
import Act from 'domain/model/act'

export default class ActService {
  constructor(actRepository, loaders) {
    this.actRepository = actRepository
    this.loaders = loaders
  }

  static build(db, loaders) {
    return new ActService(
      new ActRepository(db),
      loaders,
    )
  }

  async create(createInput) {
    const act = new Act(createInput)
    const actValidation = act.validate()
    if (!actValidation.valid) {
      throw createDomainInputError(actValidation.errors)
    }
    const addedAct = await this.actRepository.add(act)
    this.loaders.actLoader.clear(act._id)
    return addedAct.toJSON()
  }

  async update(updateInput) {
    const { id, ...propertiesToUpdate } = updateInput
    const act = this.actRepository.load(id)

    for (const propertyKey of Object.keys(propertiesToUpdate)) { // eslint-disable-line no-restricted-syntax
      act[propertyKey] = propertiesToUpdate[propertyKey]
    }

    const actValidation = act.validate()
    if (actValidation.valid) {
      const replacedDocument = await this.actRepository.replace(act)
      this.loaders.actLoader.clear(act._id)
      return replacedDocument.toJSON()
    } else {
      throw createDomainInputError(actValidation.errors)
    }
  }

  async delete(id) {
    const act = await this.actRepository.load(id)
    if (act) {
      const actsInMeditation = await this.actRepository.loadByMeditationId([act.meditationId])
      if (actsInMeditation.length > 1) {
        await this.actRepository.delete(id)
        this.loaders.actLoader.clear(id)
        this.loaders.meditationActsLoader.clear(act.meditationId)
      } else {
        throw new ApolloError('Meditation must have at least one Act', 'BAD_USER_INPUT')
      }
    } else {
      throw new ApolloError('Act not found', 'NOT_FOUND')
    }
  }
}
