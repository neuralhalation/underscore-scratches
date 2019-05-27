// _.keys and _.values

let zombie = {name: 'Bub', film: 'Day of The Dead'}

console.log(`The _.keys function: ${_.keys(zombie)}`);

console.log(`The _.values function: ${_.values(zombie)}`);

// _.pluck

let books = [
    {title: 'Chthon', author: 'Anthony'},
    {title: 'Grendel', author: 'Gardner'},
    {title: 'After Dark'}
]

function pluck_w_default(books, key) {
    return _.pluck(_.map(books, (obj) => { return _.defaults(obj, {author: 'unknown'})}), key);
}