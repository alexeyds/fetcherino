import { implementFormData, maybeAddFormDataContentType } from "form_data/implementation";
import { Response as NodeFetchResponse } from "node-fetch";

let handler = {
  construct: function(target, args) {
    let [body, opts={}] = args;
    let { headers } = opts;

    headers = maybeAddFormDataContentType(headers, {body});
    let response = new target(body, {...opts, headers});

    implementFormData(response, {body});

    return response;
  }
};


let Response = new Proxy(NodeFetchResponse, handler);

export default Response;