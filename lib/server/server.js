import MocksContainer from "utils/mocks_container";
import { buildResponse } from "server/response";
import { buildExpectedRequest, buildExpectedJSONRequest } from "server/expected_request";
import { compareRequests, inspectRequest } from "server/utils";

export default class Server {
  constructor() {
    this._mocks = new MocksContainer();
  }

  processRequest(request) {
    let mock = this._mocks.takeFirstBy(mock => {
      let { isEqual } = compareRequests(mock.request, request);
      return isEqual;
    });

    if (mock) {
      return { success: true, response: mock.response };
    } else {
      return { success: false };
    }
  }

  addMock() {
    this._doAddMock({requestBuilder: buildExpectedRequest}, ...arguments);
  }

  addJSONMock() {
    this._doAddMock({requestBuilder: buildExpectedJSONRequest}, ...arguments);
  }

  _doAddMock({requestBuilder}, ...mockArguments) {
    let request = requestBuilder(...mockArguments);
    let response = buildResponse(...mockArguments);

    let mock = {request, response};
    this._mocks.add(mock);
  }

  inspectMocks() {
    return this._mocks.all().map(m => inspectRequest(m.request)).join("\n");
  }
}