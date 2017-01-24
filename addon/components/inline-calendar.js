import Ember from "ember";
import moment from "moment";

import calendar from "glimr-calendar/lib/calendar";
import Draggable from "glimr-calendar/mixins/draggable";

import { weekdaysShort } from "glimr-calendar/lib/calendar";

export default Ember.Component.extend(Draggable, {
  classNames: ["glimr--inline-calendar"],
  classNameBindings: ["fullwide:glimr--calendar-fullwide"],

  fullwide: true,

  moment: Ember.computed(function() {
    return moment();
  }),

  clickToRange: false,
  ranges: Ember.computed(function() { return []; }),
  selectedDates: Ember.computed(function() { return []; }),
  highlightedDates: Ember.computed(function() { return []; }),
  highlightFrom: false,
  highlightTo: false,
  disabledFrom: false,
  disabledTo: false,

  // Private
  currentDragRange: false,

  date: Ember.computed("moment", function() {
    return this.get("moment").toDate();
  }),

  dayNames: Ember.computed("moment", function() {
    return weekdaysShort();
  }),

  weeks: Ember.computed("moment", function() {
    return calendar(this.get("moment"));
  }),

  activeDays: Ember.computed("selectedDates.[]", "moment", function() {
    var selectedDates = this.get("selectedDates");
    if (!selectedDates) {
      return [];
    }

    if (!Ember.isArray(selectedDates)) {
      selectedDates = [selectedDates];
    }

    var currentMoment = this.get("moment");

    return selectedDates
      .filter((date) => date.isSame(currentMoment, 'month'))
      .map((date) => date.date());
  }),

  highlightedDays: Ember.computed("highlightedDates.[]", "moment", function() {
    var highlightedDates = this.get("highlightedDates");
    if (!highlightedDates) {
      return [];
    }

    if (!Ember.isArray(highlightedDates)) {
      highlightedDates = [highlightedDates];
    }

    var currentMoment = this.get("moment");

    return highlightedDates
      .filter((date) => date.isSame(currentMoment, "month"))
      .map((date) => date.date());
  }),

  highlightCheck: Ember.computed("highlightFrom", "highlightTo", function() {
    var from = this.get("highlightFrom");
    var to = this.get("highlightTo");

    return (date) => {
      if (!from || !to || !date) {
        return false;
      } else {
        return date.unix() >= from.unix() && date.unix() <= to.unix();
      }
    };
  }),

  disabledCheck: Ember.computed("disabledFrom", "disabledTo", function() {
    var from = this.get("disabledFrom");
    var to = this.get("disabledTo");

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
  }),

  rangeCheck: Ember.computed("ranges.[]", "currentDragRange", function() {
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
  }),

  shouldStartDrag() {
    return this.get("clickToRange");
  },

  dateFromEvent(event) {
    if (event.target.dataset.week && !event.target.classList.contains("disabled")) {
      return this.get("weeks")[event.target.dataset.week][event.target.dataset.day];
    } else {
      return false;
    }
  },

  // Override in implementors
  dragStarted(mousePosition, event) {
    var date = this.dateFromEvent(event);
    if (date) {
      this.set("currentDragRangeStart", date);
    }
  },

  dragMoved(mousePosition, event) {
    var date = this.dateFromEvent(event);
    if (!date) {
      return;
    }

    var startDate = this.get("currentDragRangeStart");
    var newRange = [];
    if (startDate.unix() < date.unix()) {
      newRange = [startDate.clone().startOf("day"), date.clone().endOf("day")];
    } else {
      newRange = [date.clone().startOf("day"), startDate.clone().startOf("day")];
    }

    this.set("currentDragRange", newRange);
  },

  dragEnded(mousePosition) {
    if (this.get("currentDragRangeStart")) {
      if (Math.sqrt(Math.pow(mousePosition.deltaX, 2) + Math.pow(mousePosition.deltaY, 2)) < 5) {
        this.sendAction("selectedDate", this.get("currentDragRangeStart"));
      } else if (this.get("currentDragRange")) {
        this.sendAction("addRange", this.get("currentDragRange"));
      }
    }

    this.set("currentDragRangeStart", false);
    this.set("currentDragRange", false);
  },

  actions: {
    previousMonth() {
      this.set("moment", this.get("moment").clone().subtract(1, "month"));
      this.sendAction("updateDate", this.get("moment"));
    },

    nextMonth() {
      this.set("moment", this.get("moment").clone().add(1, "month"));
      this.sendAction("updateDate", this.get("moment"));
    },

    selectedDate(date) {
      if (!this.get("clickToRange") && !this.get("disabledCheck")(date)) {
        this.sendAction("selectedDate", date);
      }
    }
  }
});
