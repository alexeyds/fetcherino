import BodyWithContentType from "fetch_api/body/body_with_content_type";

export default function implementBody({body, contentType}) {
  let bodyWithContentType = new BodyWithContentType({body, contentType});

  defineBodyInterface.call(this, bodyWithContentType);

  return { guessedContentType: bodyWithContentType.contentType };
}

function defineBodyInterface(bodyWithContentType) {
  Object.defineProperty(this, "body", {
    get: () => {
      throw new TypeError("fetcherino does not support #body getter on objects implementing Body mixin");
    }
  });

  let bodyUsed = false;

  Object.defineProperty(this, "bodyUsed", {
    get: () => bodyUsed
  });

  ["arrayBuffer", "blob", "formData", "json", "text"].forEach(method => {
    this[method] = function() {
      if (bodyUsed) {
        return Promise.reject(new TypeError("Body has already been consumed"));
      } else {
        bodyUsed = true;
        return bodyWithContentType[method]();
      }
    };
  });
}
