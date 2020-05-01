import { isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";

export function isFormData(object) {
  return isObject(object) && object.constructor.name === "FormData";
}

export function formDataToObject(formData) {
  return iterableToObject(formData);
}