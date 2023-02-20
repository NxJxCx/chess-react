module.exports = function generatorCount(gen) {
  let count = 0;
  let a = gen.next();
  let aval = a.value;
  while (aval) {
    if (typeof aval ==="number" && a.done) { return aval; }
    count++;
    a = gen.next()
    aval = a.value;
  }
  return count;
}