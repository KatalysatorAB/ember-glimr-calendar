import Ember from "ember";

export default Ember.Mixin.create({
  shouldStartDrag(event) {
    return true;
  },

  mouseDown(event) {
    if (this.shouldStartDrag(event)) {
      event.stopPropagation();
      this.dragStart(event);
    }
  },

  attachDragEvents() {
    this.dragMoveBound = this.dragMove.bind(this);
    this.dragEndBound = this.dragEnd.bind(this);

    Ember.$(document).on("mousemove", this.dragMoveBound);
    Ember.$(document).on("mouseup", this.dragEndBound);
  },

  deattachDragEvents() {
    Ember.$(document).off("mousemove", this.dragMoveBound);
    Ember.$(document).off("mouseup", this.dragEndBound);
  },

  endDrag(mousePosition) {
    this.deattachDragEvents();
    this.dragEnded(mousePosition);
  },

  dragStart(event) {
    this.attachDragEvents();

    this.set("dragInitialPosition", {
      x: event.pageX,
      y: event.pageY
    });

    this.dragStarted({
      x: event.pageX,
      y: event.pageY,
      deltaX: 0,
      deltaY: 0,
      startX: event.pageX,
      startY: event.pageY
    }, event);
  },

  dragMove(event) {
    event.preventDefault();
    event.stopPropagation();

    var initial = this.get("dragInitialPosition");

    this.dragMoved({
      x: event.pageX,
      y: event.pageY,
      deltaX: event.pageX - initial.x,
      deltaY: event.pageY - initial.y,
      startX: initial.x,
      startY: initial.y
    }, event);
  },

  dragEnd(event) {
    event.preventDefault();
    event.stopPropagation();

    var initial = this.get("dragInitialPosition");

    this.endDrag({
      x: event.pageX,
      y: event.pageY,
      deltaX: event.pageX - initial.x,
      deltaY: event.pageY - initial.y,
      startX: initial.x,
      startY: initial.y
    });
  },

  // Override in implementors
  dragStarted(mousePosition, event) {
  },

  dragMoved(mousePosition, event) {
  },

  dragEnded(mousePosition) {
  }
});
