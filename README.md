# fetcherino
A light-weight mocking tool for replacing fetch in your tests

## Installation
```cmd
npm i fetcherino --save-dev
```

## Example Usage
```js
import { buildFetch } from "fetch";
let fetch = buildFetch();

fetch.mock('/test');
fetch("/test").then(console.log) // => Response { status: 200, body: '' }
// fetch.mock() only mocks response once
fetch("/test").catch(console.log) // => Unexpected fetch: GET /test
```


## License
MIT