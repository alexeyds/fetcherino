function formData({boundary}) {
  return `multipart/form-data; boundary=${boundary}`;
}

function formUrlEncoded({charset}={}) {
  return maybeAppendCharset("application/x-www-form-urlencoded", charset);
}

function text({charset}={}) {
  return maybeAppendCharset("text/plain", charset);
}

function json() {
  return "application/json";
}

function maybeAppendCharset(result, charset) {
  if (charset) {
    return `${result};charset=${charset}`;
  } else {
    return result;
  }
}

export default {
  formData,
  formUrlEncoded,
  text,
  json
};