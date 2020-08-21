import checkContentType from "content_type/type_checkers";

export default class CachedBody {
  constructor(target) {
    let bodyPromise = null;

    this.extract = () => {
      bodyPromise = bodyPromise || extractBody(target);
      return bodyPromise;
    };
  }
}

function extractBody(target) {
  let contentType = target.headers.get("content-type");

  if (!contentType) return target.text();

  if (checkContentType.isJSON(contentType)) {
    return target.json();
  } else if (checkContentType.isFormData(contentType) || checkContentType.isFormURLEncoded(contentType)) {
    return target.formData().then(formDataToObject);
  } else {
    return target.text();
  }
}

function formDataToObject(fd) {
  let result = {};

  for (let [k, v] of fd) {
    let arrayRegex = /\[\]$/;
    if (k.match(arrayRegex)) {
      let name = k.replace(arrayRegex, '');
      result[name] = result[name] || [];
      result[name].push(v);
    } else {
      result[k] = v;
    }
  }

  return result;
}