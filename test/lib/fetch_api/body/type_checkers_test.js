import test from "enhanced-tape";
import { isBlob, isArrayBuffer, isArrayBufferView, isFormData, isURLSearchParams, isString } from "fetch_api/body/type_checkers";
import Blob from "support/blob_stub";
import FormData from "support/form_data_stub";

test("Body type checkers", function(t) {
  t.test("isBlob", function(t) {
    t.equal(isBlob(new Blob()), true);
    t.equal(isBlob("Dasda"), false);
    t.equal(isBlob(undefined), false);
  });

  t.test("isArrayBuffer", function(t) {
    t.equal(isArrayBuffer(new ArrayBuffer()), true);
    t.equal(isArrayBuffer("Dasda"), false);
  });

  t.test("isArrayBufferView", function(t) {
    t.equal(isArrayBufferView(new Float64Array()), true);
    t.equal(isArrayBufferView(new DataView(new ArrayBuffer())), true);
    t.equal(isArrayBufferView("Dasda"), false);
    t.equal(isArrayBufferView(undefined), false);
  });

  t.test("isFormData", function(t) {
    t.equal(isFormData(new FormData()), true);
    t.equal(isFormData("Dasda"), false);
    t.equal(isFormData(undefined), false);
  });

  t.test("isURLSearchParams", function(t) {
    t.equal(isURLSearchParams(new URLSearchParams()), true);
    t.equal(isURLSearchParams("Dasda"), false);
  });

  t.test("isString", function(t) {
    t.equal(isString("123"), true);
    t.equal(isString(123), false);
  });
});
