import { tranformFormDataInputOptions, implementFormData } from "form_data/implementation";
import { Response as NodeFetchResponse } from "node-fetch";

let handler = {
  construct: function(target, args) {
    let [originalBody, opts={}] = args;
    let {body, headers} = tranformFormDataInputOptions({body: originalBody, headers: opts.headers});

    let response = new target(body, {...opts, headers});
    implementFormData(response, {body});

    return response;
  }
};

let Response = new Proxy(NodeFetchResponse, handler);

export default Response;