import Ember from 'ember';

export function fromMoment(params/*, hash*/) {
  var momentDate = params[0];
  var method = params[1];
  return momentDate[method].call(momentDate);
}

export default Ember.Helper.helper(fromMoment);
