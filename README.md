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
*Note: `text` and `json` properties on the `Response` object in the examples below are only shown for demonstration purposes, you'd still have extract them according to fetch specification(i.e through async methods)*

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

// Pre-made matchers
import { arrayIncluding } from 'fetcherino/matchers';
fetch.mock('/test', { request: { body: arrayIncluding(1) } });

params = { 
  method: 'POST',
  body: JSON.stringify([1, 2, 3]),
  headers: { 'Content-Type': 'application/json' }
}
fetch("/test", params).then(console.log); // => Response { status: 200 }

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

## License
MIT