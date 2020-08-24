export function formToObject(formLike) {
  let result = {};

  for (let [k, v] of formLike) {
    let arrayRegex = /\[\]$/;
    if (k.match(arrayRegex)) {
      let name = k.replace(arrayRegex, '');
      result[name] = result[name] || [];
      result[name].push(v);
    } else {
      result[k] = v;
    }
  }

  return result;
}