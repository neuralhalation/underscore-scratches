/** Pseudo-compose if we were to write it ourselves */

function pseudoCompose(g, f) {
  return function(x) {
    return g(f(x));
  };
}
