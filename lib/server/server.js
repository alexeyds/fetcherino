import ExpectedRequest from "expected_request";
import extractBody from "server/extract_body";
import parseRequest from "request_details/parse_request";
import { inspectRequestDetails, inspectExpectationDetails, inspectRequestWithExpectation } from "request_details/inspect";
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
      let mocksDetails = this._mocks.map(m =>  inspectExpectationDetails(m.expectation.details()));
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
    let requestDetails = parseRequest({request, body});
    let expectation = this._mostSimilarExpectation({request, body});

    if (expectation) {
      let [requestInfo, expectationInfo] = inspectRequestWithExpectation(requestDetails, expectation.details());

      return `Unexpected fetch: ${requestInfo}\n` +
             `Closest expectation: ${expectationInfo}`;
    } else {
      let requestInfo = inspectRequestDetails(requestDetails);

      return `Unexpected fetch: ${requestInfo}\n` +
             `No expectations were defined`;
    }
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
