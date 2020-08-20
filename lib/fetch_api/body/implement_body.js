import BodyWithContentType from "fetch_api/body/body_with_content_type";

export default function implementBody(target) {
  let proto = target.prototype;

  Object.defineProperty(proto, "body", {
    get: () => {
      throw new TypeError("fetcherino does not support #body getter on objects implementing Body mixin");
    }
  });

  proto.bodyUsed = false;

  ["arrayBuffer", "blob", "formData", "json", "text"].forEach(method => {
    proto[method] = function() {
      if (this.bodyUsed) {
        return Promise.reject(new TypeError("Body has already been consumed"));
      } else {
        this.bodyUsed = true;
        return this._bodyWithContentType[method]();
      }
    };
  });
}

export function initializeBody({body, contentType}) {
  let bodyWithContentType = new BodyWithContentType({body, contentType});
  this._bodyWithContentType = bodyWithContentType;

  return { guessedContentType: bodyWithContentType.contentType };
}
