import MocksContainer from "utils/mocks_container";
import Request from "request";
import Response from "response";
import { ContentTypes } from "headers/content_type";
import { mergeHeaders } from "headers/helpers";
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
      let lines = [
        `Unmatched fetch request: ${inspectRequest(request)}`,
        `  Defined mocks were:`,
        ...inspectMocks(mocks, {indent: 4})
      ];
      let error = lines.join("\n");

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

  fetch.mockJSON = function(url, opts={}) {
    let { requestHeaders, requestBody, responseHeaders, responseBody } = opts;

    requestBody = JSON.stringify(requestBody);
    requestHeaders = {"Content-Type": ContentTypes.JSON};
    responseHeaders = mergeHeaders(responseHeaders, {"Content-Type": ContentTypes.JSON});
    responseBody = JSON.stringify(responseBody);

    fetch.mock(url, {...opts,  requestHeaders, requestBody, responseHeaders, responseBody});
  };

  fetch.ensureAllMocksConsumed = function() {
    if (mocks.all().length > 0) {
      let lines = [
        "Not all mocks were consumed:",
        ...inspectMocks(mocks, {indent: 2})
      ];
      let error = lines.join("\n");

      throw new Error(error);
    }
  };

  return fetch;
}

function inspectMocks(mocksContainer, {indent=0}={}) {
  let spaces = " ".repeat(indent);
  let mocks = mocksContainer.all();

  if (mocks.length > 0) {
    return mocks.map(({expectedRequest}) => spaces + expectedRequest.inspect());
  } else {
    return [spaces + "(no mocks were defined)"];
  }
}