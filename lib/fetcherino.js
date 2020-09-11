import Server from "server";
import Request from "fetch_api/request";

export function buildFetch() {
  let server = new Server();

  function fetch() {
    let request = new Request(...arguments);
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
