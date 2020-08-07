export function delegateToMultiMap(method, {getMap, convertName, convertValue}) {
  return function(name, value) {
    let map = getMap.call(this);
    name = convertName ? convertName(name) : name;
    value = convertValue ? convertValue(value) : value;

    return map[method](name, value);
  };
}