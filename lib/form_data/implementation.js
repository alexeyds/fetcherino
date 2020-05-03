import { isFormData } from "form_data/helpers";
import { mergeHeaders } from "headers/helpers";
import { isFormDataType, ContentTypes } from "headers/content_type";

export function maybeAddFormDataContentType(headers, {body}) {
  if (isFormData(body)) {
    return mergeHeaders({"Content-Type": ContentTypes.formData}, headers);
  } else {
    return headers;
  }
}

export function implementFormData(target, {body}) {
  function formData() {
    return this.text().then(() => {  
      if (isFormData(body) && isFormDataType(this.headers)) {
        return Promise.resolve(body);
      } else {    
        let error = new TypeError("Could not parse content as FormData.");

        return Promise.reject(error);
      }
    });
  }

  Object.defineProperty(target, "formData", {enumerable: true, value: formData});
}