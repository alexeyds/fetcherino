import MocksContainer from "utils/mocks_container";
import Request from "request";
import Response from "response";
import { inspectRequest } from "request/inspect";
import ExpectedRequest from "expected_request";

export function buildFetch() {
  let mocks = new MocksContainer();

  function fetch() {
    let request = new Request(...arguments);
    let mock = mocks.takeFirstBy(({expectedRequest}) => expectedRequest.isEqual(request));

    if (mock) {
      return Promise.resolve(mock.response);
    } else {
      let error = "Unmatched fetch request: ";
      error += inspectRequest(request);
      error += "\n";
      error += "Defined mocks were:";
      error += "\n";
      error += mocks.all().map(({expectedRequest}) => expectedRequest.inspect()).join("\n");

      throw new Error(error);
    }
  }

  fetch.mock = function(url, {
    responseStatus, 
    responseBody, 
    responseHeaders, 
    requestMethod, 
    requestBody, 
    requestHeaders
  }={}) {
    let request = new Request(url, {method: requestMethod, body: requestBody, headers: requestHeaders});
    let expectedRequest = new ExpectedRequest(request);

    let response = new Response(responseBody, {url, status: responseStatus, headers: responseHeaders});

    mocks.add({response, expectedRequest});
  };

  return fetch;
}