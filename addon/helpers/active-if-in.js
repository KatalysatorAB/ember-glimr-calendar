import Ember from 'ember';

export function activeIfIn(params, hash) {
  const array = params[0];
  const child = params[1];

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

export default Ember.Helper.helper(activeIfIn);
