import { serialize as phpSerialize } from 'php-serialize'

export function stableSerialize(object: Record<string, any>): string {
  // 1) Sort the object alphabetically by it's keys
  object = sortByKey(object)

  // 2) Encode arrays in their string form: `[1, 2, 3]` -> `'1, 2, 3'`
  // 3) Encode any non-strings as their JSON stringified version: `3` -> `'3'`
  for (const property in object) {
    if (object.hasOwnProperty(property) && typeof object[property] !== 'string') {
      if (Array.isArray(object[property])) {
        object[property] = object[property].join(', ')
      } else {
        object[property] = JSON.stringify(object[property])
      }
    }
  }

  // 4) Serialize in the way that PHP would
  return phpSerialize(object)
}

function sortByKey(object: Record<string, any>) {
  const keys = Object.keys(object).sort()

  const sortedObject: Record<string, any> = {}
  for (const i in keys) {
    sortedObject[keys[i]] = object[keys[i]]
  }

  return sortedObject
}
