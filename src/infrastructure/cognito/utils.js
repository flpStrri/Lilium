import { concat } from 'ramda'

export const toCamelCase = str => str.replace(/[-_]([a-z])/g, m => m[1].toUpperCase())
export const toSnakeCase = str => str.replace(/([A-Z])/g, x => concat('_', x.toLowerCase()))
