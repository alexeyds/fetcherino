import { isBlob, isArrayBuffer, isArrayBufferView, isFormData, isURLSearchParams, isString } from "fetch_api/body/type_checkers";
import FormData from "fetch_api/form_data";
import * as checkContentType from "utils/content_type_checkers";

export default class BodyWithContentType {
  constructor({body, contentType}) {
    this.body = this._serializeBody({body, contentType});
    this.contentType = contentType || this._getContentType(this.body);
  }

  text() {
    return Promise.resolve(this._bodyAsText(this.body));
  }

  blob() {
    let body = this.body;

    if (isBlob(body)) {
      return Promise.resolve(body);
    } else {
      throw new TypeError("fetcherino does not yet support converting arbitrary body types into Blobs.");
    }
  }

  formData() {
    let body = this.body;
    let contentType = this.contentType;

    let formData = this._bodyAsFormData({body, contentType});

    if (formData) {
      return Promise.resolve(formData);
    } else {
      let parsingError = new TypeError("Could not parse content as FormData.");
      return Promise.reject(parsingError);
    }
  }

  arrayBuffer() {
    let body = this.body;
    let result = body;

    if (isArrayBufferView(body)) {
      result = body.buffer;
    } else if (isBlob(body)) {
      result = body.arrayBuffer();
    } else if (isArrayBuffer(body)) {
      result = body;
    } else {
      result = this.text().then(t => new TextEncoder().encode(t));
    }

    return Promise.resolve(result);
  }

  json() {
    return this.text().then(text => JSON.parse(text));
  }

  _serializeBody({body, contentType}) {
    if (isString(body) && contentType && checkContentType.isURLEncoded(contentType)) {
      return new URLSearchParams(body);
    } else if (this._isValidBodyType(body)) {
      return body;
    } else {
      return body.toString();
    }
  }

  _getContentType(body) {
    if (isBlob(body)) {
      return body.type === "" ? null : body.type;
    } else if(isFormData(body)) {
      return "multipart/form-data; boundary=---------------------------21313147027889412191056238728";
    } else if(isURLSearchParams(body)) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if(isString(body)) {
      return "text/plain;charset=UTF-8";
    }

    return null;
  }

  _isValidBodyType(body) {
    return isArrayBuffer(body) || 
           isArrayBufferView(body) || 
           isBlob(body) || 
           isFormData(body) || 
           isURLSearchParams(body) ||
           isString(body);
  }

  _bodyAsText(body) {
    if (isArrayBufferView(body) || isArrayBuffer(body)) {
      return new TextDecoder().decode(body);
    } else if (isBlob(body)) {
      return body.text();
    } else if (isFormData(body)) {
      throw new TypeError("fetcherino does not yet support representing FormData objects as text.");
    } else if(isURLSearchParams(body)) {
      return body.toString();
    } else {
      return body;
    }
  }

  _bodyAsFormData({body, contentType}) {
    if (isFormData(body) && checkContentType.isFormData(contentType)) {
      return body;
    } else if (isURLSearchParams(body) && checkContentType.isURLEncoded(contentType)) {
      return this._searchParamsToFormData(body);
    } else {
      return null;
    }
  }

  _searchParamsToFormData(searchParams) {
    let fd = new FormData();

    for (let [k, v] of searchParams.entries()) { 
      fd.append(k ,v); 
    }

    return fd;
  }
}
