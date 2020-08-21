import implementBody from "fetch_api/body/implement_body";

export default class Response {
  constructor(body, {statusText="", status=200, headers: headersLike}={}) {
    if (status < 200 || status >= 600) {
      throw new RangeError("Response constructor: Invalid response status code.");
    }

    let ok = status < 300;
    let { headers } = implementBody.call(this, {body, headersLike});

    defineGetters.call(this, {
      statusText,
      status,
      ok,
      headers,
      redirected: false,
      type: "default",
      url: ""
    });
  }
}


function defineGetters(properties) {
  for (let k in properties) {
    Object.defineProperty(this, k, {get: () => properties[k]});
  }
}
