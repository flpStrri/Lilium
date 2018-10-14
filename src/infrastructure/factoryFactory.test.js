import casual from 'casual'
import factoryFactory from './factoryFactory'

describe('factoryFactory', () => {
  it('should create a function given a function', () => {
    const mockCasualGenerator = jest.fn()

    const mockFactory = factoryFactory(mockCasualGenerator)

    expect(mockFactory).toBeInstanceOf(Function)
    expect(mockCasualGenerator.mock.calls.length).toBe(0)
  })
  it('should return an primitive when called with one or undefined', () => {
    const mockCasualGenerator = jest.fn(() => 42)

    const mockFactory = factoryFactory(mockCasualGenerator)

    expect(mockFactory()).toBe(42)
    expect(mockFactory(1)).toBe(42)
    expect(mockCasualGenerator.mock.calls.length).toBe(2)
  })
  it('should return an array of primitives when called with a value higher then one', () => {
    const mockCasualGenerator = jest.fn(() => 42)

    const mockFactory = factoryFactory(mockCasualGenerator)

    expect(mockFactory(2)).toEqual(expect.arrayContaining([42, 42]))
    expect(mockFactory(2).length).toBe(2)
    expect(mockFactory(3)).toEqual(expect.arrayContaining([42, 42, 42]))
    expect(mockFactory(3).length).toBe(3)
    expect(mockCasualGenerator.mock.calls.length).toBe(10)
  })
})
