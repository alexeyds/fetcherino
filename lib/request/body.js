import { parseFormData, formDataToObject } from "form_data/helpers";
import { isJSONType, isFormDataType } from "headers/content_type";

export function parseRequestBody(request) {
  let { body, headers } = request;

  if (body) {
    let bodyString = body.toString();

    if (isJSONType(headers)) {
      return JSON.parse(bodyString);
    } else if (isFormDataType(headers)) {
      return formDataToObject(parseFormData(bodyString));
    } else {
      return bodyString;
    }
  } else {
    return body;
  }
}