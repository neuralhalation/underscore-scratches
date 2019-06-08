const r = require('ramda')

/** function separated from relying on the computer's clock */
function daysInMonth(year, month) {
  const start = new Date(year, month - 1, 1),
    end = new Date(year, month, 1)
  return (end - start) / (1000 * 60 * 60 * 24)
}

/** theoretically, every function is a *single-valued* collection of pairs */

/** functions are *nouns* */

/** domain -> what is given to the function
 *  range -> what is output by the function
 */

/** sometimes '.' gives us too much.
 *  better that we can compose on it.
 *  hence it might be good to write our own get()
 */

function get(prop, obj) {
  return obj[prop]
}

/** introduction to currying */

function curry(func, ...arg) {
  return () => {
    if (func.length > arg.length) {
      const slice = Array.prototype.slice
      const args = slice.apply(arg)
      return () => {
        return func.apply(null, args.concat(slice.apply(arg)))
      }
    }
    return func.apply(null, arg)
  }
}

/** rewriting get() now that we can curry */

const getWCurry = curry((property, object) => {
  return object[property]
})

people = [{ name: 'Peter', age: 19 }, { name: 'Alexi', age: 43 }]

const names = people.map(get('name'))
