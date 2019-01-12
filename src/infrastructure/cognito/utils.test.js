import { toCamelCase, toSnakeCase } from 'infrastructure/cognito/utils'

describe('Cognito utils', () => {
  it('should convert snake_case to camelCase', () => {
    const testString = 'snake_case'
    expect(toCamelCase(testString)).toEqual('snakeCase')
  })
  it('should convert camelCase to snake_case', () => {
    const testString = 'camelCase'
    expect(toSnakeCase(testString)).toEqual('camel_case')
  })
})