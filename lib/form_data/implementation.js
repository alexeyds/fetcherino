import { isFormData, stringifyFormData, parseFormData } from "form_data/helpers";
import { mergeHeaders } from "headers/helpers";
import { isFormDataType, ContentTypes } from "headers/content_type";

export function tranformFormDataInputOptions({body, headers}) {
  if (isFormData(body)) {
    body = stringifyFormData(body);
    headers = mergeHeaders({"Content-Type": ContentTypes.formData}, headers);
    return {body, headers};
  } else {
    return {body, headers};
  }
}

export function implementFormData(target) {
  function formData() {
    return this.text().then((body) => {
      if (isFormDataType(this.headers)) {
        return parseFormData(body);
      } else {
        let error = new TypeError("Could not parse content as FormData.");

        return Promise.reject(error);
      }
    });
  }

  Object.defineProperty(target, "formData", {enumerable: true, value: formData});
}