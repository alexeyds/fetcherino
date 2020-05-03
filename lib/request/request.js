import { implementFormData, maybeAddFormDataContentType } from "form_data/implementation";
import { Request as NodeFetchRequest } from "node-fetch";

let handler = {
  construct: function(target, args) {
    let [url, opts={}] = args;
    let { body, headers } = opts;

    headers = maybeAddFormDataContentType(headers, {body});
    let request = new target(url, {...opts, headers});

    implementFormData(request, {body});

    return request;
  }
};


let Request = new Proxy(NodeFetchRequest, handler);

export default Request;