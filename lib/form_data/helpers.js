import { hasMethod, isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";

export function isFormData(object) {
  return isObject(object) && hasMethod(object, "append") && hasMethod(object, "entries");
}

export function formDataToObject(formData) {
  return iterableToObject(formData);
}