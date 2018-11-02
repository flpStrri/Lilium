import { UserInputError } from 'apollo-server'
import { createDomainInputError } from './domainFunctions'

describe('domainFunctions', () => {
  it('should create a function given a GraphQL UserInputError', () => {
    const error = createDomainInputError([{ message: 'foo' }])

    expect(error).toBeInstanceOf(UserInputError)
    expect(error.message).toBe('Arguments invalid')
    expect(error.invalidArgs).toContainEqual('foo')
  })
})
