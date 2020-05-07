import { isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";
import FormData from "formdata-node";

export function isFormData(object) {
  return isObject(object) && object.constructor.name === "FormData";
}

export function formDataToObject(formData) {
  return iterableToObject(formData);
}

export function objectToFormData(obj) {
  let result = new FormData();

  for (let k in obj) {
    result.append(k, obj[k]);
  }

  return result;
}

const FORM_DATA_SEPARATOR = "form-data-mock----";

export function stringifyFormData(formData) {
  return FORM_DATA_SEPARATOR + JSON.stringify(formDataToObject(formData));
}

export function parseFormData(str) {
  try {
    let json = str.split(FORM_DATA_SEPARATOR)[1];
    return objectToFormData(JSON.parse(json));
  } catch(e) {
    throw new TypeError(`Unable to parse string as FormData: ${str}`);
  }
}