import test from "enhanced-tape";
import { testRejects } from "test/support/promise_helpers";
import { buildFetch } from "dist/fetcherino";
import { createMatcher, arrayIncluding, objectIncluding, equalTo, arrayIncludingSubset } from '../../matchers';
import { JSDOM } from 'jsdom';

test("README test", function(t) {
  t.setup(() => ({ fetch: buildFetch() }));

  function testUnexpectedFetch(t, promise) {
    return testRejects(t, promise, /Unexpected fetch/);  
  }

  t.test("example usage", function(t) {
    t.test("mocks response once", async function(t, {fetch}) {
      fetch.mock('/test');

      await fetch('/test').then(async r => {
        t.equal(r.status, 200);
        t.equal(await r.text(), '');
      });

      await testUnexpectedFetch(t, fetch('/test'));
    });

    t.test("mocked responses are returned in order", async function(t, {fetch}) {
      fetch.mock('/test', { response: { body: 'Hello' } });
      fetch.mock('/test', { response: { body: 'Hi' } });

      await fetch('/test').then(async r => {
        t.equal(await r.text(), 'Hello');
      });

      await fetch('/test').then(async r => {
        t.equal(await r.text(), 'Hi');
      });
    });

    t.test("matches request body and query partially by default", async function(_t, {fetch}) {
      fetch.mock('/test', { request: { body: { foo: 'bar' }, query: { a: 'b' } } });

      let payload = { 
        method: 'POST',
        body: JSON.stringify({foo: 'bar', bar: 'baz'}),
        headers: { 'Content-Type': 'application/json' }
      };
      await fetch("/test?a=b&b=c", payload);
    });

    t.test("has pre-made matchers", async function(_t, {fetch}) {
      fetch.mock(
        url => url.includes('test'),
        { request: { body: arrayIncluding(1) } }
      );

      let params = { 
        method: 'POST',
        body: JSON.stringify([1, 2, 3]),
        headers: { 'Content-Type': 'application/json' }
      };
      await fetch("/foobar/test/123", params);
    });

    t.test("has validateAndResetMocks method", async function(t, {fetch}) {
      fetch.validateAndResetMocks();
      fetch.mock('/test');
      t.throws(() => fetch.validateAndResetMocks(), /request expectations/);
      await testUnexpectedFetch(t, fetch('/test'));
    });

    t.test("works with JSDOM", async function(_t, {fetch}) {
      let jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.com' });
      let { FormData, File } = jsdom.window;

      let myFile = new File(['test'], 'foobar.pdf');
      fetch.mock('/test', { request: { body: { foo: 'bar', file: myFile } } });

      let fd = new FormData();
      fd.append('foo', 'bar');
      fd.append('file', myFile);
      await fetch('/test', {method: 'POST', body: fd});
    });
  });

  t.test("matchers section", function(t) {
    t.test("has simple matcher example", async function(t, {fetch}) {
      fetch.mock(url => url.includes('/test'));

      await testUnexpectedFetch(t, fetch("/foo"));
      await fetch("/test");
    });

    t.test("has createMatcher example", async function(t, {fetch}) {
      fetch.mock(createMatcher(url => url.includes('/test'), "(test url)"));

      await testUnexpectedFetch(t, fetch("/foo"));
    });

    t.test("has objectIncluding section", async function(t, {fetch}) {
      fetch.mock('/test', { request: { query: objectIncluding({foo: 'bar'}) } });

      await testUnexpectedFetch(t, fetch('/test?foo=baz'));
      await fetch('/test?foo=bar&bar=baz');
    });

    t.test("has equalTo section", async function(t, {fetch}) {
      fetch.mock('/test', { request: { query: equalTo({foo: 'bar'}) } });

      await testUnexpectedFetch(t, fetch('/test?foo=bar&bar=baz'));
      await fetch('/test?foo=bar');
    });

    function postJSON({body}) {
      return {
        body: JSON.stringify(body),
        method: "POST",
        headers: { 'Content-Type': 'application/json' } 
      };
    }

    t.test("has arrayIncluding section", async function(t, {fetch}) {
      fetch.mock('/test', { request: { body: arrayIncluding(1) } });

      await testUnexpectedFetch(t, fetch('/test', postJSON({ body: [2, 3, 4] })));
      await fetch('/test', postJSON({ body: [1, 2, 3] }));
    });

    t.test("has arrayIncludingSubset section", async function(t, {fetch}) {
      fetch.mock('/test', { request: { body: arrayIncludingSubset({a: 1}) } });

      await testUnexpectedFetch(t, fetch('/test', postJSON({ body: [1, 2, { a: 2 }] })));
      await fetch('/test', postJSON({ body: [1, 2, { a: 1, b: 2}] }));
    });
  });
});
