/*
high-order function:
  - a function that takes a function as an argument
  - a function that returns a function as a result
*/

// note: the capitalization of captured variables is not recommended
// when writing closures

// starting simple with _.max

const _ = require('underscore')
const c = require('./closures')

const nums = [1,2,3,4,5]

console.log(_.max(nums));

const people = [{name: "Fred", age: 65}, {name: "Lucy", age: 36}]

console.log(_.max(people, (p) => { return p.age }));

// improving _.max w/ finder

const finder = (valueFun, bestFun, coll) {
    return _.reduce(coll, (best, current) => {
        let bestValue = valueFun(best);
        let currentValue = valueFun(current);
        return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
    });
}

console.log(finder(_.identity, Math.max, nums));

console.log(finder(plucker('age'), Math.max, people));

const peopleWithLNames = finder(plucker('name'),
    (x, y) => { return (x.charAt(0) === "L") ? x : y },
    people
);

console.log(peopleWithLNames);

/*
Finder can be improved by making two assumptions:
- the best-value function returns 'true' if the argument is "better" than the
  second argument
- the best-value function knows how to "unwrap" its arguments
*/

const best = (fun, coll) => {
    return _.reduce(coll, (x, y) => {
        return fun(x, y) ? x : y
    });
}

const maxNum = best((x, y) => { return x > y }, nums);

console.log(`maxNum: ${maxNum}`);

// best has the same functionality as _.max

// 3 related functions & how to make them more generic

const repeat = (times, VALUE) => {
    return _.map(_.range(times), () => { return VALUE; });
}

console.log(repeat(4, "Major"));

// what if we need to repeatedly run an opperation?

const repeatedly = (times, fun) => {
    return _.map(_.range(times), fun);
}

const randomFloors = repeatedly(3, 
    () => { return Math.floor((Math.random()*10)+1);
});

console.log(`randomFloors: ${randomFloors}`);

// now with constant values

console.log(repeatedly(3, () => { return "Odelay!" }));

// now to make some DOM nodes

repeatedly(3, (n) => {
    let id = 'id' + n;
    $('body').append($("<p>Odelay!</p>").attr('id', id));
    return id;
})

/*
'repeatedly' is ok, but could be better. its first argument still relies on
a fixed value, rather than a function. functional is thinking functions, not
values!

instead of a value, what about a condition?
*/

const iterateUntil = (fun, check, init) => {
    let ret = []
    let result = fun(init);

    while (check(result)) {
        ret.push(result)
        result = fun(result);
    }

    return ret;
}

/*
'iterateUntil' takes two functions:
- a function that performs some action
- a function that checks a result, returing false if the result is a "stop"
  value
*/

const goTo1024 = iterateUntil((n) => { return n + n},
    (n) => { return n <= 1024 },
    1
);

console.log(`goTo1024: ${goTo1024}`);

/*
'repeatedly' is nice when you know exactly how many times you need to do something.
'iterateUntil' is nice because you know at least when to stop.
*/

