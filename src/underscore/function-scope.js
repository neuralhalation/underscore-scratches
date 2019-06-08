const strangeIdentity = n => {
  // intentionally strange
  for (let i = 0; i < n; i++);
  return i
}

console.log(strangeIdentity(138))

// scoping has changed a lot in ES6 with the introduction of const, let,
// and block scope
