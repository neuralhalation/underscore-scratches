// simplest example of a closure is a first-class function that captures
// a local variable for later use

function whatWasTheLocal() {
    let CAPTURED = 'Oh hai';
    return function() {
        return `The local was ${CAPTURED}`;
    }
}

const reportLocal = whatWasTheLocal();

console.log(reportLocal());

// function args can be captured as well

function createScaleFunction(FACTOR) {
    return function(v) {
        return _.map(v, function(n) {
            return (n * FACTOR);
        });
    };
}

const scale10 = createScaleFunction(10);

console.log(scale10([1, 2, 3]));

// putting it together with this

function createWeirdScaleFunction(FACTOR) {
    return function(v) {
        this['FACTOR'] = FACTOR;
        let captures = this;

        return _.map(v, _.bind(function(n) {
            return (n * this['FACTOR']);
        }, captures));
    }
}

const weirdScale10 = createWeirdScaleFunction(10);

console.log(weirdScale10.call({}, [5,6,7]))

// free variables

function makeAdder(CAPTURED) {
    return function(x) {
        return x + CAPTURED;
    };
}

const add10 = makeAdder(10);

console.log(add10(32));

// closures capturing functions

const average = (array) => {
    let sum = _.reduce(array, (a, b) => { return a+b });
    return sum / _.size(array);
}

const averageDamp = (FUN) => {
    return (n) => {
        return average([n, FUN(n)]);
    }
}

const averageSq = averageDamp((n) => { return n * n });

console.log(averageSq(10));

// using closures

const complement = (PRED) => {
    return () => {
        return !PRED.apply(null, _.toArray(arguments));
    };
}

let isEven = (n) => {
    return (n%2) === 0
}

let isOdd = complement(isEven);

console.log(`Using isEven(2): ${isEven(2)}`);
console.log(`Using isOdd(2): ${isOdd(2)}`);
console.log(`Using isOdd(3): ${isOdd(3)}`);