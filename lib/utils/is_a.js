export default function isA(object, className) {
  return boolean(object) && isConstructorNameEqual(object, className);
}

function isConstructorNameEqual(object, name) {
  return object.constructor.name === name;
}

function boolean(object) {
  return !!object;
}
