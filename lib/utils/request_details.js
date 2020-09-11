import { parseQuery } from "utils/url";

export default class RequestDetails {
  constructor({request, body}) {
    let [url, query] = parseQuery(request.url);
    let extraAttributes = {
      url,
      query,
      body,
      headers: Object.fromEntries(request.headers.entries())
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
