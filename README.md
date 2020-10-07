# fetcherino
A light-weight mocking tool for replacing fetch in your tests

## Installation
```cmd
npm i fetcherino --save-dev
```

## Example Usage
*Note: `text` and `json` properties on the `Response` object in the examples below are only shown for demonstration purposes, you'd still have extract them according to fetch specification(i.e through async methods)*

```js
import { buildFetch } from "fetcherino";
let fetch = buildFetch();

//-- Each mock can only be consumed once
fetch.mock('/test');
fetch("/test").then(console.log); // => Response { status: 200, text: '' }
fetch("/test").catch(console.log); // => Unexpected fetch: GET /test

//-- Responses are returned in the order they were defined
fetch.mock('/test', { response: { body: 'Hello' } });
fetch.mock('/test', { response: { body: 'Hi' } });
fetch("/test").then(console.log); // => Response { status: 200, text: 'Hello' }
fetch("/test").then(console.log); // => Response { status: 200, text: 'Hi' }

//-- Objects are matched partially by default
fetch.mock('/test', { request: { body: { foo: 'bar' }, query: { a: 'b' } } });

fetch("/test?a=b&b=c", { 
  method: 'POST',
  body: JSON.stringify({foo: 'bar', bar: 'baz'}),
  headers: { 'Content-Type': 'application/json' }
}).then(console.log); // => Response { status: 200 }

//-- Pre-made matchers(for custom matchers see below)
import { arrayIncluding } from 'fetcherino/matchers';

fetch.mock('/test', { request: { body: arrayIncluding(1) } });
fetch("/test", { 
  method: 'POST',
  body: JSON.stringify([1, 2, 3]),
  headers: { 'Content-Type': 'application/json' }
}).then(console.log); // => Response { status: 200 }

//-- Validating and resetting mocks
fetch.validateAndResetMocks(); // => does nothing since there are no mocks defined yet
fetch.mock('/test');
fetch.validateAndResetMocks(); // => Throws [Error: Not all fetch.mock request expectations were met]
fetch("/test").catch(console.log); // => Unexpected fetch: GET /test

//-- FormData matching
import { JSDOM } from 'jsdom';
let jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.com' });
// Here we are using JSDOM since it's the most common way to setup browser environment within tests,
// but fetcherino will work with any FormData class as long as it adhers to standard FormData interface
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