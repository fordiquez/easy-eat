// export const filter = (objects, filteredKeys) => {
//   return Object.keys(objects).filter(key => filteredKeys.includes(key)).reduce((obj, key) => {
//     return {
//       ...obj,
//       [key]: objects[key]
//     }
//   }, {})
// }

// export const filter = (objects, filteredKeys) => {
//   return filteredKeys.reduce((obj, key) => ({ ...obj, [key]: objects[key] }), {})
// }

// export const filter = (objects, filteredKeys) => {
//   return Object.assign({}, ...filteredKeys.map(key => ({ [key]: objects[key] })))
// }

export const excludedFilter = (objects, excludedKeys) => {
  return Object.fromEntries(Object.entries(objects).filter(([key]) => !excludedKeys.includes(key)))
}

export const includedFilter = (objects, includedKeys) => {
  return Object.fromEntries(includedKeys.map(k => [k, objects[k]]))
}
