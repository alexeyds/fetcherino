import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";

export default class RequestDetails {
  constructor({request, body}) {
    let [url, query] = parseQuery(request.url);
    let extraAttributes = {
      url,
      query,
      body,
      headers: formToObject(request.headers)
    };

    this.get = (key) => {
      if (key in extraAttributes) {
        return extraAttributes[key];
      } else {
        return request[key];
      }
    };
  }
}
