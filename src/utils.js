export function isGenerator(fn) {
  return (
    fn.prototype.next && fn.prototype.throw ?
    true : // eslint-disable-line no-unneeded-ternary
    false
  );
}
