const r = require('ramda');

/** https://jsbin.com/romun/3/edit */

// r.multiply() already curried

console.log(r.multiply(3, 4));

const double = r.multiply(2);

console.log(double(13));

/**
 * Challenge 1: Make a function called "words" which returns a list
 * of words in a string using only r.split() & currying
 */

const words = r.split(' ');
assertArraysAreEqual(['one', 'two', 'three'], words('one two three'));

 /**
  * Challenge 2: create a function to triple every number in a list
  * using only r.multiply() and r.map()
  */

const tripleList = r.map(r.multiply(3));
assertArraysAreEqual([3, 6, 9], tripleList([1, 2, 3]));

/**
 * Challenge 3: create a function to find the largest #
 * in a list. use greater() and r.map(), r.filter(), or r.reduce() 
 */
const greater = function(a, b) {
    return a > b ? a: b;
}
const max = r.reduce(greater, -2);
assertEqual(9, max([1, -348, 9, 7, 2]));
assertEqual(-1, max([-12, -3483, -2, -1]));

console.log('All tests pass');

 /**
  * assertions
  */

  function assertArraysAreEqual(x, y) {
      if (x.length !== y.length) throw (`expected ${x} to = ${y}`);
      for (let i in x) {
          if (x[i] !== y[i]) {
              throw (`expected ${x} to = ${y}`)
          }
      }
  }

  function assertEqual(x, y) {
      if(x !== y) throw (`expected ${x} to = ${y}`);
  }