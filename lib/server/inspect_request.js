import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";
import { isEmpty } from "utils/object";
import { inspect } from "util";

export default function inspectRequest(request, {body, includeAttributes=[]}={}) {
  let [url, query] = parseQuery(request.url);
  let mainInfo = `${request.method} ${url}`;
  if (body !== undefined) mainInfo += " " + inspect(body);

  let result = [mainInfo];

  if (!isEmpty(query)) result.push(`query: ${inspect(query)}`);

  includeAttributes.forEach(attr => {
    if (attr === "headers") {
      result.push(`headers: ${inspect(formToObject(request.headers))}`);
    } else if (attr !== "method") {
      result.push(`${attr}: ${request[attr]}`);
    }
  });

  return result.join(", ");
}
