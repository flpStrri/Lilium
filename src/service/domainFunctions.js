import { UserInputError } from 'apollo-server'

export const createDomainInputError = errorArray => new UserInputError(
  'Arguments invalid',
  { invalidArgs: errorArray.map(error => error.message) },
)
