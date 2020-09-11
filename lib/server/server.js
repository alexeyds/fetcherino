import ExpectedRequest from "expected_request";
import extractBody from "server/extract_body";
import { requestDetails, inspectDetails } from "server/inspection_utils";
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

  validateAndResetMocks() {
    if (this._mocks.length !== 0) {
      let mocksDetails = this._mocks.map(m =>  inspectDetails(m.expectation.details()));
      this._mocks = [];
      throw new Error(`Not all fetch.mock request expectations were met:\n${mocksDetails.join('\n')}`);
    }
  }

  async fetch(request) {
    let body = await extractBody(request);
    let mock = this._extractMock({request, body});

    if (mock) {
      return Promise.resolve(mock.response);
    } else {
      throw new Error(this._unexpectedFetchError({request, body}));
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

  _unexpectedFetchError({request, body}) {
    let expectation = this._mostSimilarExpectation({request, body});
    let expectationDetails = expectation && expectation.details();

    let includeFields = expectationDetails ? Object.keys(expectationDetails) : [];
    let details = requestDetails({request, body, includeFields});

    let expectationsInfo = expectationDetails ? 
      `Closest expectation: (${inspectDetails(expectationDetails)}` :
      `No expectations were defined`
    ;

    return `Unexpected fetch: (${inspectDetails(details)})\n${expectationsInfo}`;
  }

  _mostSimilarExpectation({request, body}) {
    let result;
    let lastSimilarityPercent;

    this._mocks.forEach(mock => {
      let similarity = mock.expectation.similarityPercent({request, body});

      if (!result || similarity > lastSimilarityPercent) {
        result = mock.expectation;
        lastSimilarityPercent = similarity;
      }
    });

    return result;
  }
}
