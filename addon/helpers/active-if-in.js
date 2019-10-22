import { helper as buildHelper } from '@ember/component/helper';

export function activeIfIn([array, child], hash) {
  const className = hash["class"];

  if (!className) {
    throw new Error("No class name passed to `active-if-in`");
  }

  if (typeof array === "function") {
    return array(child) ? className : "";
  } else {
    return array.indexOf(child) !== -1 ? className : "";
  }
}

export default buildHelper(activeIfIn);
