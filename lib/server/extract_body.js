import { formToObject } from "utils/form";
import checkContentType from "content_type/type_checkers";

export default async function extractBody(target) {
  let contentType = target.headers.get("content-type");

  if (!contentType) return target.text();

  if (checkContentType.isJSON(contentType)) {
    return target.text().then(safeJSONParse);
  } else if (checkContentType.isFormData(contentType) || checkContentType.isFormURLEncoded(contentType)) {
    return target.formData().then(formToObject, () => 'Unparsable FormData body');
  } else {
    return target.text();
  }
}

function safeJSONParse(body) {
  try {
    return JSON.parse(body);
  } catch(e) {
    return body;
  }
}
