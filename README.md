# fetcherino
A light-weight mocking tool for replacing fetch in your tests

## Installation
```cmd
npm i fetcherino --save-dev
```

## Main advantages
- Lightweight and standalone: can be used out of the box with no external dependencies
- Can be seamlessy integrated into any environment: browser, `JSDOM`, `node-fetch`
- Clearcut API: single `fetch.mock(path, {request, response})` method, no magic method chains
- Clearcut behaviour: explicit request ordering, no "forever mocks", one-to-one mock-request correlation
- Informative errors: you'll know right away why your request didn't match existing mocks

## Currently NOT supported
- Body streams
- AbortController

## Example Usage
*Note: any properties on the `Response` object in the examples below are only shown for demonstration purposes, you'd still have extract them according to fetch specification(e.g through async methods)*

```js
import { buildFetch } from "fetcherino";
let fetch = buildFetch();
let params;

// Each mock can only be consumed once
fetch.mock('/test');
fetch("/test").then(console.log); // => Response { status: 200, text: '' }
fetch("/test").catch(console.log); // => Unexpected fetch: GET /test

// Responses are returned in the order they were defined
fetch.mock('/test', { response: { body: 'Hello' } });
fetch.mock('/test', { response: { body: 'Hi' } });
fetch("/test").then(console.log); // => Response { status: 200, text: 'Hello' }
fetch("/test").then(console.log); // => Response { status: 200, text: 'Hi' }

// Objects are matched partially by default
fetch.mock('/test', { request: { body: { foo: 'bar' }, query: { a: 'b' } } });

params = { 
  method: 'POST',
  body: JSON.stringify({foo: 'bar', bar: 'baz'}),
  headers: { 'Content-Type': 'application/json' }
};
fetch("/test?a=b&b=c", params).then(console.log); // => Response { status: 200 }

// Pre-made and custom matchers
import { arrayIncluding } from 'fetcherino/matchers';
fetch.mock(
  url => url.includes('test'),
  { request: { body: arrayIncluding(1) } }
);

params = { 
  method: 'POST',
  body: JSON.stringify([1, 2, 3]),
  headers: { 'Content-Type': 'application/json' }
}
fetch("/foobar/test/123", params).then(console.log); // => Response { status: 200 }

// Validating and resetting mocks
fetch.validateAndResetMocks(); // => does nothing since there are no mocks defined yet
fetch.mock('/test');
fetch.validateAndResetMocks(); // => Throws Not all fetch.mock request expectations were met
fetch("/test").catch(console.log); // => Unexpected fetch: GET /test

// JSDOM integration
import { JSDOM } from 'jsdom';
let jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.com' });
let { FormData, File } = jsdom.window;

let myFile = new File(['test'], 'foobar.pdf');
fetch.mock('/test', { request: { body: { foo: 'bar', file: myFile } } });

let fd = new FormData();
fd.append('foo', 'bar');
fd.append('file', myFile);
fetch('/test', {method: 'POST', body: fd}).then(console.log) // => Response { status: 200 };
```

## `buildFetch()`
Returns a `fetch` function which will reject any unexpected request(i.e a request without any matching mocks defined), but behaves like normal `fetch` otherwise.

*Note: fetcherino does not by itself provide any functionality for mocking or replacing fetch globally. Each function returned from `buildFetch` is self-contained and does not share anything with other `buildFetch()` instances. If you want to have single global fetch function, you'll have to setup one yourself, for example:*

```js
// test_setup.js
import { buildFetch } from "fetcherino";
let fetch = buildFetch();

window.fetch = fetch;
global.fetch = fetch;
```

## `fetch.mock(urlMatcher, { request, response })`
Allows you to define a request expectation for given url. For more details on matching requests see below.

Accepted `request` matchers: `cache`, `credentials`, `mode`, `redirect`, `referrer`, `method`, `body`, `headers`, `query`\
Accepted `response` details: `body`, `statusText`, `status`, `headers`

## `fetch.validateAndResetMocks()`
Resets all defined mocks for given `fetch` function. Will throw if there are unmatched(unconsumed) mocks left.

## Matchers
Fetcherino implements potent but extremely simple and straightforward system for matching request expectations. Any request expectation detail passed to `fetch.mock()`(e.g `url`, `request.body`, `request.headers`) is converted into a matcher function according to the given expectation detail's type:
- `Function` details are returned as is.
- `Object` details are converted into an [`objectIncluding`](#objectincluding) matcher.
- Anything else is converted into an [`equalTo`](#equalto) matcher.


Matcher function is any function which takes one argument and returns a boolean. For example, we can use a custom matcher function for the request url instead of passing it as a string:

```js
import { buildFetch } from "fetcherino";
let fetch = buildFetch();

fetch.mock(url => url.includes('/test'));

// Error: Unexpected fetch: GET /foo
// Closest expectation: ANY function (url) {
//                  return url.includes(/test);
//                }
fetch("/foo").catch(console.log);

// Response { status: 200 }
fetch("/test").then(console.log);
```

### `createMatcher(matcherFunction, description)`
In the above example we dont have a good way to inspect the expected url except by inspecting the matcher function itself. This is where the `createMatcher` helper comes in, allowing you to specify readable description of a matcher function:

```js
import { buildFetch } from "fetcherino";
import { createMatcher } from "fetcherino/matchers";
let fetch = buildFetch();

fetch.mock(createMatcher(url => url.includes('/test'), "(url matching /test)"));

// Throws:
// Error: Unexpected fetch: GET /foo
// Closest expectation: ANY (url matching /test)
fetch("/foo").catch(console.log);
```

### `objectIncluding(subset)`
Uses `lodash.ismatch` to match target object(e.g request body) against its potential subset. All objects given to `fetch.mock` are converted to this matcher by default.

### `equalTo(target)`
Uses `lodash.isequal` to check two objects for equality. All strings, numbers, boolean arguments, etc., given to `fetch.mock` are converted to this matcher by default.

### `arrayIncluding(object)`
Checks whether target array contains given object. Object equality is checked via `lodash.isequal`

### `arrayIncludingSubset(subset)`
Checks whether target array contains a subset of a given object. Uses `lodash.ismatch`

## License
MIT