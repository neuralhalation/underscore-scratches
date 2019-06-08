/* eslint-disable prefer-spread */
const _ = require('underscore')

// simplest example of a closure is a first-class function that captures
// a local variable for later use

const whatWasTheLocal = () => {
  const CAPTURED = 'Oh hai'
  return function() {
    return `The local was ${CAPTURED}`
  }
}

const reportLocal = whatWasTheLocal()

console.log(reportLocal())

// function args can be captured as well

const createScaleFunction = FACTOR => {
  return function(v) {
    return _.map(v, function(n) {
      return n * FACTOR
    })
  }
}

const scale10 = createScaleFunction(10)

console.log(scale10([1, 2, 3]))

// putting it together with this

const createWeirdScaleFunction = FACTOR => {
  return v => {
    this['FACTOR'] = FACTOR
    const captures = this

    return _.map(
      v,
      _.bind(function(n) {
        return n * this['FACTOR']
      }, captures)
    )
  }
}

const weirdScale10 = createWeirdScaleFunction(10)

console.log(weirdScale10.call({}, [5, 6, 7]))

// free variables

const makeAdder = CAPTURED => {
  return x => {
    return x + CAPTURED
  }
}

const add10 = makeAdder(10)

console.log(add10(32))

// closures capturing functions

const average = array => {
  const sum = _.reduce(array, (a, b) => {
    return a + b
  })
  return sum / _.size(array)
}

const averageDamp = fun => {
  return n => {
    return average([n, fun(n)])
  }
}

const averageSq = averageDamp(n => {
  return n * n
})

console.log(averageSq(10))

// using closures

const complement = PRED => {
  return () => {
    return !PRED.apply(null, _.toArray(arguments))
  }
}

const isEven = n => {
  return n % 2 === 0
}

const isOdd = complement(isEven)

console.log(`Using isEven(2): ${isEven(2)}`)
console.log(`Using isOdd(2): ${isOdd(2)}`)
console.log(`Using isOdd(3): ${isOdd(3)}`)

// closures as abstraction

/**
 * @param {*} FIELD
 * @return {*} The value of field.
 */
const plucker = FIELD => {
  return obj => {
    return obj && obj[FIELD]
  }
}

const best = { title: 'Infinite Jest', author: 'DFW' }

const getTitle = plucker('title')

console.log(getTitle(best))

const books = [{ title: 'Chthon' }, { stars: 5 }, { titles: 'Botchan' }]

const third = plucker(2)

console.log(third(books))

console.log(_.filter(books, getTitle))

exports.complement = complement
exports.isOdd = isOdd
exports.isEven = isEven
exports.plucker = plucker
