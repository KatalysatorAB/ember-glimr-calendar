import Component from "@ember/component";
import layout from '../templates/components/inline-calendar';

import { computed, action } from "@ember/object";
import { isArray } from '@ember/array';

import calendar from "glimr-calendar/lib/calendar";
import Draggable from "glimr-calendar/lib/draggable";

import { weekdaysShort } from "glimr-calendar/lib/calendar";

export default class InlineCalendar extends Component.extend({
  layout
}) {
  classNames = ["glimr--inline-calendar"];
  classNameBindings = ["fullwide:glimr--calendar-fullwide"];

  fullwide = true;

  clickToRange = false;

  init() {
    super.init();

    this.draggable = new Draggable({
      dragStarted: this.dragStarted,
      dragMoved: this.dragMoved,
      dragEnded: this.dragEnded,
    });
  }

  willDestroyElement() {
    super.willDestroyElement();
    this.draggable.destroy();
  }

  mouseDown(event) {
    this.draggable.mouseDown(event);
  }

  @computed()
  get selectedDates() {
    return [];
  }

  highlightedDates() {}

  // actions
  selectedDate() {}
  addRange() {}
  updateDate() {}

  highlightFrom = false;
  highlightTo = false;
  disabledFrom = false;
  disabledTo = false;

  // Private
  currentDragRange = false;

  @computed("moment")
  get date() {
    return this.get("moment").toDate();
  }

  @computed("moment")
  get dayNames() {
    return weekdaysShort();
  }

  @computed("moment")
  get weeks() {
    return calendar(this.get("moment"));
  }

  @computed("selectedDates.[]", "moment")
  get activeDays() {
    let selectedDates = this.get("selectedDates");
    if (!selectedDates) {
      return [];
    }

    if (!isArray(selectedDates)) {
      selectedDates = [selectedDates];
    }

    let currentMoment = this.get("moment");

    return selectedDates
      .filter((date) => date.isSame(currentMoment, 'month'))
      .map((date) => date.date());
  }

  @computed("highlightedDates.[]", "moment")
  get highlightedDays() {
    let highlightedDates = this.get("highlightedDates");
    if (!highlightedDates) {
      return [];
    }

    if (!isArray(highlightedDates)) {
      highlightedDates = [highlightedDates];
    }

    let currentMoment = this.get("moment");

    return highlightedDates
      .filter((date) => date.isSame(currentMoment, "month"))
      .map((date) => date.date());
  }

  @computed("highlightFrom", "highlightTo")
  get highlightCheck() {
    let from = this.get("highlightFrom");
    let to = this.get("highlightTo");

    return (date) => {
      if (!from || !to || !date) {
        return false;
      } else {
        return date.unix() >= from.unix() && date.unix() <= to.unix();
      }
    };
  }

  @computed("disabledFrom", "disabledTo")
  get disabledCheck() {
    let from = this.get("disabledFrom");
    let to = this.get("disabledTo");

    return (date) => {
      if (!date) {
        return false;
      }
      if (from && to) {
        return !(date.unix() >= from.unix() && date.unix() <= to.unix());
      }
      if (from) {
        return date.unix() >= from.unix();
      }
      if (to) {
        return date.unix() <= to.unix();
      }
      return false;
    };
  }

  @computed("ranges.[]", "currentDragRange")
  get rangeCheck() {
    return (date) => {
      if (!date) {
        return false;
      }

      return this.get("ranges").concat([this.get("currentDragRange")]).some((range) => {
        if (!range || range.length <= 1) {
          return false;
        }

        return range[0].isBefore(date.clone().endOf("day")) &&
          range[1].isAfter(date.clone().startOf("day"));
      });
    };
  }

  @action
  shouldStartDrag() {
    return this.get("clickToRange");
  }

  @action
  dateFromEvent(event) {
    if (event.target.dataset.week && !event.target.classList.contains("disabled")) {
      return this.get("weeks")[event.target.dataset.week][event.target.dataset.day];
    } else {
      return false;
    }
  }

  @action
  dragStarted(mousePosition, event) {
    let date = this.dateFromEvent(event);
    if (date) {
      this.set("currentDragRangeStart", date);
    }
  }

  @action
  dragMoved(mousePosition, event) {
    let date = this.dateFromEvent(event);
    if (!date) {
      return;
    }

    let startDate = this.get("currentDragRangeStart");
    let newRange = [];
    if (startDate.unix() < date.unix()) {
      newRange = [startDate.clone().startOf("day"), date.clone().endOf("day")];
    } else {
      newRange = [date.clone().startOf("day"), startDate.clone().startOf("day")];
    }

    this.set("currentDragRange", newRange);
  }

  @action
  dragEnded(mousePosition) {
    if (this.get("currentDragRangeStart")) {
      if (Math.sqrt(Math.pow(mousePosition.deltaX, 2) + Math.pow(mousePosition.deltaY, 2)) < 5) {
        this.selectedDate(this.get("currentDragRangeStart"));
      } else if (this.get("currentDragRange")) {
        this.addRange(this.get("currentDragRange"));
      }
    }

    this.set("currentDragRangeStart", false);
    this.set("currentDragRange", false);
  }

  @action
  previousMonth() {
    this.set("moment", this.get("moment").clone().subtract(1, "month"));
    this.updateDate(this.get("moment"));
  }

  @action
  nextMonth() {
    this.set("moment", this.get("moment").clone().add(1, "month"));
    this.updateDate(this.get("moment"));
  }

  @action
  didSelectDate(date) {
    if (!this.get("clickToRange") && !this.get("disabledCheck")(date)) {
      this.selectedDate(date);
    }
  }
}
