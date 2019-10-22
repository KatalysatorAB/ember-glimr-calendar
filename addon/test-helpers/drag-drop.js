export function pointForElement(element) {
  const pos = element.getBoundingClientRect();

  const offsetX = pos.width / 2;
  const offsetY = pos.height / 2;
  const pageX = pos.left + offsetX;
  const pageY = pos.top + offsetY;

  return {
    pageX: pageX + document.body.scrollLeft,
    pageY: pageY + document.body.scrollTop,
    clientX: pageX,
    clientY: pageY,
    target: element[0]
  };
}

export function dragFromTo(fromElement, toElement) {
  const fromPoint = pointForElement(fromElement);
  const toPoint = pointForElement(toElement);

  const mouseDown = document.createEvent("HTMLEvents");
  mouseDown.initEvent("mousedown", true, true);

  Object.assign(mouseDown, fromPoint);

  fromElement.dispatchEvent(mouseDown);

  const mouseMove = document.createEvent("HTMLEvents");
  mouseMove.initEvent("mousemove", true, true);
  Object.assign(mouseMove, toPoint);

  document.body.dispatchEvent(mouseMove);

  const mouseUp = document.createEvent("HTMLEvents");
  mouseUp.initEvent("mouseup", true, true);
  Object.assign(mouseUp, toPoint);

  document.body.dispatchEvent(mouseUp);
}
