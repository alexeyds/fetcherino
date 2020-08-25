import ExpectedRequest from "mock/expected_request";
import extractBody from "server/extract_body";
import Response  from "fetch_api/response";

export default class Server {
  constructor() {
    this._mocks = [];
  }

  mock(url, {request, response={}}={}) {
    let mock = {
      expectation: new ExpectedRequest(url, request),
      response: new Response(response.body, response)
    };

    this._addMock(mock);
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

  _addMock(mock) {
    this._mocks.push(mock);
  }

  _extractMock({request, body}) {
    let mockIndex = this._mocks.findIndex(m => m.expectation.matches({request, body}));

    if (mockIndex !== -1) {
      let result = this._mocks[mockIndex];
      this._mocks.splice(mockIndex, 1);
      return result;
    }
  }
}
