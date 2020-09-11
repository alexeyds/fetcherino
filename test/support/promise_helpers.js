export function testRejects(t, promise, errorRegex) {
  return promise.then(
    () => t.fail(`expected promise to reject with ${errorRegex} but nothing was rejected`),
    (e) => t.match(e.message, errorRegex)
  );
}