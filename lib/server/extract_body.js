import { formToObject } from "utils/form";
import checkContentType from "content_type/type_checkers";

export default async function extractBody(target) {
  let contentType = target.headers.get("content-type");

  if (!contentType) return target.text();

  if (checkContentType.isJSON(contentType)) {
    return target.json();
  } else if (checkContentType.isFormData(contentType) || checkContentType.isFormURLEncoded(contentType)) {
    return target.formData().then(formToObject);
  } else {
    return target.text();
  }
}
