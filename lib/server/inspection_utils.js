import { inspect } from "util";
import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";
import { isEmpty } from "utils/object";

export function requestDetails({request, body, includeFields=[]}) {
  let [url, query] = parseQuery(request.url);
  let details = { url, method: request.method };

  if (body) details.body = inspect(body);
  if (!isEmpty(query)) details.query = inspect(query);

  includeFields.forEach(field => {
    if (!(field in details)) {
      details[field] = parseRequestField(field, request[field]);
    }
  });

  return details;
}

function parseRequestField(name, value) {
  if (name === "headers") {
    value = formToObject(value);
  }

  return inspect(value);
}

export function inspectDetails({url, method, body, ...details}) {
  let basicInfo = `${method} ${url}`;  
  if (body) basicInfo += ' ' + body;

  let additionalInfo = Object.entries(details).map(([k, v]) => {
    return `${k}: ${v}`;
  });

  return [basicInfo, ...additionalInfo].join(", ");
}
