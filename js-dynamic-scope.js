// the terror of this

function globalThis() { return this; }

console.log(`Some global object, probably Window: ${globalThis()}`);

console.log(`Using .call(): ${globalThis.call('barnabas')}`);

console.log('Now we can mutate it...')

console.log(`Using .apply(): ${globalThis.apply('orsulak', [])}`);