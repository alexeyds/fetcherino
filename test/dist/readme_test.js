import test from "enhanced-tape";
import { testRejects } from "test/support/promise_helpers";
import { buildFetch } from "dist/fetcherino";
import { arrayIncluding } from '../../matchers';
import { JSDOM } from 'jsdom';

// mock once
// partial body matching
// mock reset
// formdata support
// fetcherino/matchers

test("README test", function(t) {
  t.setup(() => ({ fetch: buildFetch() }));

  t.test("example usage", function(t) {
    t.test("mocks response once", async function(t, {fetch}) {
      fetch.mock('/test');

      await fetch('/test').then(async r => {
        t.equal(r.status, 200);
        t.equal(await r.text(), '');
      });

      await testRejects(t, fetch('/test'), /Unexpected fetch/);
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

      await fetch("/test?a=b&b=c", { 
        method: 'POST',
        body: JSON.stringify({foo: 'bar', bar: 'baz'}),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    t.test("has pre-made matchers", async function(_t, {fetch}) {
      fetch.mock('/test', { request: { body: arrayIncluding(1) } });

      await fetch("/test", { 
        method: 'POST',
        body: JSON.stringify([1, 2, 3]),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    t.test("has validateAndResetMocks method", async function(t, {fetch}) {
      fetch.validateAndResetMocks();
      fetch.mock('/test');
      t.throws(() => fetch.validateAndResetMocks(), /equest expectations/);
      await testRejects(t, fetch('/test'), /Unexpected fetch/);
    });

    t.test("works with formdata", async function(_t, {fetch}) {
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
});
