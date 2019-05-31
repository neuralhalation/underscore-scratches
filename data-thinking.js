const _ = require('underscore');

// _.keys and _.values

const zombie = {name: 'Bub', film: 'Day of The Dead'};

console.log(`The _.keys function: ${_.keys(zombie)}`);

console.log(`The _.values function: ${_.values(zombie)}`);

// _.pluck

const books = [
  {title: 'Chthon', author: 'Anthony'},
  {title: 'Grendel', author: 'Gardner'},
  {title: 'After Dark'},
];

const pluckWDefault = (books, defaults, key) => {
  return _.pluck(_.map(books, (obj) => {
    return _.defaults(obj, defaults);
  }), key);
};

console.log(`The _.pluck function: ${_.pluck(books, 'author')}`);

const authors = pluckWDefault(books, {author: 'unknown'}, 'author');

console.log(authors);
