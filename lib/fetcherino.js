import Server from "server";
import Request from "fetch_api/request";
import isA from "utils/is_a";

export function buildFetch() {
  let server = new Server();

  function fetch() {
    let request;

    if (arguments.length === 1 && isA(arguments[0], "Request")) {
      request = arguments[0];
    } else {
      request = new Request(...arguments);
    }
    return server.fetch(request);
  }

  fetch.mock = function() {
    server.mock(...arguments);
  };

  fetch.validateAndResetMocks = function () { 
    server.validateAndResetMocks();
  };

  return fetch;
}
