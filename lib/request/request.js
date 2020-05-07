import { tranformFormDataInputOptions, implementFormData } from "form_data/implementation";
import { Request as NodeFetchRequest } from "node-fetch";

let handler = {
  construct: function(target, args) {
    let [url, opts={}] = args;
    let { body, headers } = tranformFormDataInputOptions({body: opts.body, headers: opts.headers});

    let request = new target(url, {...opts, body, headers});
    implementFormData(request, {body});

    return request;
  }
};


let Request = new Proxy(NodeFetchRequest, handler);

export default Request;