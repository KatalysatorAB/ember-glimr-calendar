import hbs from "htmlbars-inline-precompile";
import { test, moduleForComponent } from "ember-qunit";
import Ember from "ember";
import moment from "moment";

import { dragFromTo } from "glimr-calendar/test-helpers/drag-drop";

let intlService;

function buildDateMoment(dateString) {
  return moment(dateString + " 12:00", "YYYY-MM-DD HH:II");
}

moduleForComponent("glimr/inline-calendar", "InlineCalendarComponent", {
  integration: true,
  setup() {
    intlService = this.container.lookup("service:intl");
    intlService.setLocale("en-us");

    this.set("january2017", buildDateMoment("2017-01-01"));
  }
});

test("Render HTML", function(assert) {
  this.render(hbs`
    {{glimr/inline-calendar}}
  `);

  assert.equal(this.$(".glimr--calendar-navigation").length, 1,
    "it should render navigation"
  );

  assert.equal(this.$(".glimr--inline-calendar").length, 1,
    "it should render itself"
  );
});

test("Render fullwide", function(assert) {
  this.render(hbs`
    {{glimr/inline-calendar
      fullwide=true
    }}
  `);

  assert.equal(this.$(".glimr--inline-calendar.glimr--calendar-fullwide").length, 1,
    "it should apply correct class"
  );
});

test("Show selected dates", function(assert) {
  this.set("selectedDates", [
    buildDateMoment("2017-01-01"),
    buildDateMoment("2017-01-02"),
    buildDateMoment("2017-03-01")
  ]);

  this.render(hbs`
    {{glimr/inline-calendar
      moment=january2017
      selectedDates=selectedDates
    }}
  `);

  assert.equal(this.$(".glimr--calendar-active").length, 2,
    "it should show selected in current moment"
  );
});

test("Click to select dates", function(assert) {
  this.set("selectedDates", Ember.A([
    buildDateMoment("2017-01-01")
  ]));

  this.set("addSelectedDate", (date) => {
    this.get("selectedDates").pushObject(date);
  });

  this.render(hbs`
    {{glimr/inline-calendar
      moment=january2017
      selectedDates=selectedDates
      selectedDate=(action addSelectedDate)}}
    }}
  `);

  this.$("tbody tr:eq(1) td:eq(3)").click();

  assert.equal(this.$(".glimr--calendar-active").length, 2);
  assert.equal(this.get("selectedDates.length"), 2);
});

test("Rendering ranges", function(assert) {
  this.set("ranges", Ember.A([
    [
      buildDateMoment("2017-01-01"),
      buildDateMoment("2017-01-05")
    ]
  ]));

  this.render(hbs`
    {{glimr/inline-calendar
      moment=january2017
      ranges=ranges}}
    }}
  `);

  assert.equal(this.$(".glimr--calendar-range").length, 5);
});

test("Drag and drop a range of dates", function(assert) {
  this.set("ranges", Ember.A([]));

  this.set("addRange", (date) => {
    this.get("ranges").pushObject(date);
  });

  this.render(hbs`
    {{glimr/inline-calendar
      moment=january2017
      clickToRange=true
      ranges=ranges
      addRange=(action addRange)}}
    }}
  `);

  Ember.run(() => {
    dragFromTo(
      this.$("tbody tr:eq(1) td:eq(1)"),
      this.$("tbody tr:eq(1) td:eq(5)")
    );
    Ember.run.next(() => {
      assert.equal(this.$(".glimr--calendar-range").length, 5);
      assert.equal(this.get("ranges").length, 1);
    });
  });
});

test("Only allow this week", function(assert) {
  this.set("startOfWeek", buildDateMoment("2017-01-23"));
  this.set("endOfWeek", buildDateMoment("2017-01-29"));

  this.set("selectedDates", Ember.A([]));

  this.set("addSelectedDate", (date) => {
    this.get("selectedDates").pushObject(date);
  });

  this.render(hbs`
    {{glimr/inline-calendar
      moment=january2017
      disabledTo=endOfWeek
      disabledFrom=startOfWeek
      selectedDate=(action addSelectedDate)}}
    }}
  `);

  assert.equal(this.$(".glimr--calendar-disabled").length, 24);

  // Click in disabled range
  this.$("tbody tr:eq(1) td:eq(3)").click();
  assert.equal(this.get("selectedDates").length, 0);

  // Click in enabled range
  this.$("tbody tr:eq(3) td:eq(3)").click();

  assert.equal(this.get("selectedDates").length, 1);
});
