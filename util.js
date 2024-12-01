// parses all integers out of a string, returns them in an array
function ints(s, neg = true) {
  let reg = /\d+/g;
  if (neg) reg = /-?\d+/g;
  return [...s.matchAll(reg)].map(x => +(x[0]));
}