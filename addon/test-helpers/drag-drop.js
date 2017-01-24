import Ember from "ember";

export function pointForElement(element) {
  var offsetX = element.width() / 2;
  var offsetY = element.height() / 2;
  var pageX = element.offset().left + offsetX;
  var pageY = element.offset().top + offsetY;

  return {
    pageX: pageX,
    pageY: pageY,
    clientX: pageX - Ember.$(document).scrollLeft(),
    clientY: pageY - Ember.$(document).scrollTop(),
    target: element[0]
  };
}

export function dragFromTo(fromElement, toElement) {
  const fromPoint = pointForElement(fromElement);
  const toPoint = pointForElement(toElement);

  const mouseDown = Ember.$.Event("mousedown");
  Ember.assign(mouseDown, fromPoint);

  fromElement.trigger(mouseDown);

  const mouseMove = Ember.$.Event("mousemove");
  Ember.assign(mouseMove, toPoint);

  Ember.$("body").trigger(mouseMove);

  const mouseUp = Ember.$.Event("mouseup");
  Ember.assign(mouseUp, toPoint);

  Ember.$("body").trigger(mouseUp);
}
