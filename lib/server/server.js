import ExpectedRequest from "mock/expected_request";
import extractBody from "server/extract_body";
import { parseQuery } from "utils/url";
import Response  from "fetch_api/response";

export default class Server {
  constructor() {
    this._mocks = {};
  }

  mock(url, {request, response={}}={}) {
    let mock = {
      expectation: new ExpectedRequest(request),
      response: new Response(response.body, response)
    };

    this._addMock(url, mock);
  }

  async fetch(request) {
    let body = await extractBody(request);
    let mock = this._extractMock({request, body});

    if (mock) {
      return Promise.resolve(mock.response);
    } else {
      throw new Error("No matching mocks were defined");
    }
  }

  _addMock(url, mock) {
    this._mocks[url] = this._mocks[url] || [];
    this._mocks[url].push(mock);
  }

  _extractMock({request, body}) {
    let [url] = parseQuery(request.url);
    let mocks = this._mocks[url];

    if (mocks) {
      let mockIndex = mocks.findIndex(m => m.expectation.matches({request, body}));

      if (mockIndex !== -1) {
        let result = mocks[mockIndex];
        mocks.splice(mockIndex, 1);
        return result;
      }
    }
  }
}
