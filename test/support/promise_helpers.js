export function testRejects(t, promise, errorRegex) {
  return promise.then(() => t.fail("did not reject"), (e) => t.match(e.message, errorRegex));
}