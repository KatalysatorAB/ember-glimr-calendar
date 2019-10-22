export default class Draggable {
  constructor(callbacks) {
    this.callbacks = {};
    this.callbacks.dragStarted = callbacks.dragStarted || ((mousePosition, event) => {}); // eslint-disable-line no-unused-vars
    this.callbacks.dragMoved = callbacks.dragMoved || ((mousePosition, event) => {}); // eslint-disable-line no-unused-vars
    this.callbacks.dragEnded = callbacks.dragEnded || ((mousePosition) => {}); // eslint-disable-line no-unused-vars
    this.callbacks.shouldStartDrag = callbacks.shouldStartDrag || ((mousePosition) => true); // eslint-disable-line no-unused-vars
  }

  destroy() {
    this.deattachDragEvents();
  }

  mouseDown(event) {
    if (this.callbacks.shouldStartDrag(event)) {
      event.stopPropagation();
      this.dragStart(event);
    }
  }

  attachDragEvents() {
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragEnd);
  }

  deattachDragEvents() {
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragEnd);
  }

  endDrag(mousePosition) {
    this.deattachDragEvents();
    this.callbacks.dragEnded(mousePosition);
  }

  dragStart(event) {
    this.attachDragEvents();

    this.dragInitialPosition = {
      x: event.pageX,
      y: event.pageY
    }

    this.callbacks.dragStarted({
      x: event.pageX,
      y: event.pageY,
      deltaX: 0,
      deltaY: 0,
      startX: event.pageX,
      startY: event.pageY
    }, event);
  }

  dragMove = (event) => {
    event.preventDefault();
    event.stopPropagation();

    var initial = this.dragInitialPosition;

    this.callbacks.dragMoved({
      x: event.pageX,
      y: event.pageY,
      deltaX: event.pageX - initial.x,
      deltaY: event.pageY - initial.y,
      startX: initial.x,
      startY: initial.y
    }, event);
  }

  dragEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();

    var initial = this.dragInitialPosition;

    this.endDrag({
      x: event.pageX,
      y: event.pageY,
      deltaX: event.pageX - initial.x,
      deltaY: event.pageY - initial.y,
      startX: initial.x,
      startY: initial.y
    });
  }
}
