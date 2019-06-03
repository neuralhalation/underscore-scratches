/* eslint-disable prefer-spread */
/*
high-order function:
  - a function that takes a function as an argument
  - a function that returns a function as a result
*/

// note: the capitalization of captured variables is not recommended
// when writing closures
// starting simple with _.max
const _ = require('underscore');
const c = require('./closures');
const et = require('./existy-and-truthy');

const cat = () => {
  const head = _.first(arguments);
  if (et.existy(head)) {
    return head.concat.apply(head, _.rest(arguments));
  } else {
    return [];
  };
};

const nums = [1, 2, 3, 4, 5];

console.log(_.max(nums));

const people = [{name: 'Fred', age: 65}, {name: 'Lucy', age: 36}];

console.log(_.max(people, (p) => {
  return p.age;
}));

// improving _.max w/ finder

const finder = (valueFun, bestFun, coll) => {
  return _.reduce(coll, (best, current) => {
    const bestValue = valueFun(best);
    const currentValue = valueFun(current);
    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
};

console.log(finder(_.identity, Math.max, nums));

console.log(finder(c.plucker('age'), Math.max, people));

const peopleWithLNames = finder(c.plucker('name'),
    (x, y) => {
      return (x.charAt(0) === 'L') ? x : y;
    },
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
    return fun(x, y) ? x : y;
  });
};

const maxNum = best((x, y) => {
  return x > y;
}, nums);

console.log(`maxNum: ${maxNum}`);

// best has the same functionality as _.max

// 3 related functions & how to make them more generic

const repeat = (times, VALUE) => {
  return _.map(_.range(times), () => {
    return VALUE;
  });
};

console.log(repeat(4, 'Major'));

// what if we need to repeatedly run an opperation?

const repeatedly = (times, fun) => {
  return _.map(_.range(times), fun);
};

const randomFloors = repeatedly(3,
    () => {
      return Math.floor((Math.random()*10)+1);
    });

console.log(`randomFloors: ${randomFloors}`);

// now with constant values

console.log(repeatedly(3, () => {
  return 'Odelay!';
}));

// now to make some DOM nodes

repeatedly(3, (n) => {
  const id = 'id' + n;
  // $('body').append($('<p>Odelay!</p>').attr('id', id));
  return id;
});

/*
'repeatedly' is ok, but could be better. its first argument still relies on
a fixed value, rather than a function. functional is thinking functions, not
values!

instead of a value, what about a condition?
*/

const iterateUntil = (fun, check, init) => {
  const ret = [];
  let result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  }

  return ret;
};

/*
'iterateUntil' takes two functions:
- a function that performs some action
- a function that checks a result, returing false if the result is a "stop"
  value
*/

const goTo1024 = iterateUntil((n) => {
  return n + n;
},
(n) => {
  return n <= 1024;
},
1
);

console.log(`goTo1024: ${goTo1024}`);

/*
'repeatedly' is nice when you know exactly how many times you need to
 do omething.
'iterateUntil' is nice because you know at least when to stop.
*/

/*
 -- Functions returning functions --
*/

/*
 a function returning a constant that it's almost a design pattern,
 usually called 'k' here, it's called 'always'. note that this function
 captures a value, is a closure.
*/

const always = (VALUE) => {
  return () => {
    return VALUE;
  };
};

const f = always(() => {});
console.log(`f() === f(): ${f() === f()}`);

const g = always(() => {});
console.log(`f() === g(): ${f() === g()}`);

// 'always' is what is known as a *combinator*

/*
 a function to guard against nonexistence: fnull
 - takes a function as an argument, and a number of additional arguments
 - returns a function that calls the original function given
 - if any of the arguments to the function that it returns are null or
   undefined, then the original 'default' argument is used instead
*/

const fnull = (func /* , defaults */) => {
  const defaults = _.rest(arguments);

  return (/* args */) => {
    const args = _.map(arguments, (e, i) => {
      return et.existy(e) ? e: defaults[i];
    });

    return func.apply(null, args);
  };
};

const nullNums = [1, 2, 3, null, 5];

const safeMult = fnull((total, n) => {
  return total * n;
}, 1, 1);

console.log(`_.reduce(nullNums, safeMult); : ${_.reduce(nullNums, safeMult)}`);

// to fix the configuration object problem

const defaults = (d) => {
  return (o, k) => {
    const val = fnull(_.identity, d[k]);
    return o && val(o[k]);
  };
};

const doSomething = (config) => {
  const lookup = defaults({critical: 108});
  return lookup(config, 'critical');
};

console.log(`doSomething({critical: 9}); : ${doSomething({critical: 9})}`);
console.log(`doSomething({}); : ${doSomething({})} `);

/*
 -- Object Validators --
 - validating the veracity of an object based on arbitrary criteria

 - e.g., recieve external commands via JSON objects
*/

const jsonResponse = {
  message: 'Hi!',
  type: 'display',
  from: 'http://localhost:8080/node/frob',
};

const checker = (/* validators */) => {
  const validators = _.toArray(arguments);

  return (obj) => {
    return _.reduce(validators, (errs, check) => {
      if (check(obj)) {
        return errs;
      } else {
        return _.chain(errs).push(check.message).value();
      }
    }, []);
  };
};

const alwaysPasses = checker(always(true), always(true));
console.log(`alwaysPasses({}); : ${alwaysPasses({})}`);

const fails = always(false);
fails.message = 'a failure in life';
const alwaysFails = checker(fails);
console.log(`alwaysFails({}); : ${alwaysFails({})}`);

const validator = (message, fun) => {
  const f = (/* args */) => {
    return fun.apply(fun, arguments);
  };
  f['message'] = message;
  return f;
};

const gonnaFail = checker(validator('ZOMG!', always(false)));
console.log(`gonnaFail(100); : ${gonnaFail(100)}`);

const aMap = (obj) => {
  return _.isObject(obj);
};

const checkCommand = checker(validator('must be a map', aMap));
console.log(`checkCommand({}); : ${checkCommand({})}`);
console.log(`checkCommand(42); : ${checkCommand(42)}`);

const hasKeys = () => {
  const KEYS = _.toArray(arguments);

  const fun = (obj) => {
    return _.every(KEYS, (k) => {
      return _.has(obj, k);
    });
  };

  fun.message = cat(['Must have values for keys:'], KEYS).join(' ');
  return fun;
};

const checkResponse = checker(validator('must be a map', aMap),
    hasKeys('msg', 'type'));

console.log(`checkResponse(jsonResponse); : ${checkResponse(jsonResponse)}`);
console.log(`checkResponse({msg: "blah", type: "display"}); : ${checkResponse({msg: 'blah', type: 'display'})}`);
console.log(`checkResponse(32); : ${checkResponse(32)}`);
console.log(`checkResponse({}); : ${checkResponse({})}`);

exports.cat = cat;
exports.max = max;
exports.finder = finder;
exports.best = best;
exports.repeatedly = repeatedly;
exports.iterateUntil = iterateUntil;
exports.checker = checker;
exports.validator = validator;
exports.aMap = aMap;
exports.hasKeys = hasKeys;
