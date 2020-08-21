import { capitalize } from "utils/string";
import implementBody from "fetch_api/body/implement_body";

export default class Request {
  constructor(url, options={}) {
    if (arguments.length === 0) {
      throw new TypeError("Request constructor: At least 1 argument required, but only 0 passed");
    }

    let { headers: headersLike, body } = options;
    let parsedOptions = initOptions(options);

    if (body && parsedOptions.method === "GET" || parsedOptions.method === "HEAD") {
      throw new TypeError("Request constructor: HEAD or GET Request cannot have a body.");
    }

    let { headers } = implementBody.call(this, {body: body, headersLike});

    defineGetters.call(this, {
      url,
      headers,
      destination: "",
      referrerPolicy: "",
      ...parsedOptions
    });
  }
}

function initOptions({
  cache="default",
  credentials="same-origin",
  integrity="",
  method="GET",
  mode="cors",
  redirect="follow",
  referrer="about:client"
}) {
  validateOption("cache", cache, ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"]);
  validateOption("mode", mode, ["same-origin", "no-cors", "cors"]);
  validateOption("redirect", redirect, ["follow", "manual", "error"]);
  validateOption("credentials", credentials, ["omit", "same-origin", "include"]);
  method = standardizeMethod(method);

  return {
    cache,
    credentials,
    integrity,
    method,
    mode,
    redirect,
    referrer
  };
}

function validateOption(name, value, validValues) {
  if (validValues.indexOf(value) === -1) {
    throw new TypeError(
      `Request constructor: '${value}'` + 
      `(value of '${name}' member of RequestInit)` + 
      `is not a valid value for enumeration Request${capitalize(name)}.`
    );
  }
}

function standardizeMethod(method) {
  let upperCasedMethod = method.toUpperCase();
  let standardMethods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"];

  if (standardMethods.indexOf(upperCasedMethod) === -1) {
    return method;
  } else {
    return upperCasedMethod;
  } 
}

function defineGetters(properties) {
  for (let k in properties) {
    Object.defineProperty(this, k, {get: () => properties[k]});
  }
}
