# glimr-calendar  [![Ember Observer Score](https://emberobserver.com/badges/glimr-calendar.svg)](https://emberobserver.com/addons/glimr-calendar)

You need a highly customizable base for a calendar component? Well you got one!

- Drag and drop to create ranges
- Click to select dates
- Navigation previous/next month

## Installation

* `ember install glimr-calendar`

### Translations

[glimr-calendar](https://glimr.com/KatalysatorAB/glimr-calendar) depends on [ember-intl](https://github.com/jasonmit/ember-intl) for translations. For navigation you need to add the following keys to your translation files:

```yaml
"glimr.date.previous": "Previous"
"glimr.date.next": "Next"
```

## Usage

```hbs
{{glimr/inline-calendar}}  
```

### Available properties

- `moment: moment`: The date that it is visible to start with
- `clickToRange: boolean`: If "click to range" feature is enabled. Default: `false`
- `ranges: Array<[moment, moment]>`: An array of array of moment objects for the defined ranges.
- `selectedDates: Array<moment>`: An array of moment objects to be selected. (They get the `active` class)
- `highlightedDates: Array<moment>`: An array of moment objects to be highlighted. (They get the `highlighted` class)
- `highlightFrom: moment`: The start date to highlight. (Any dates _after_ get the `highlighted` class)
- `highlightTo: `: The end date to highlight. (Any dates _before_ get the `highlighted` class)
- `disabledFrom: `: The start date to disable. These dates are not clickable. (Any dates _after_ get the `disabled` class)
- `disabledTo: `: The end date to disable. These dates are not clickable. (Any dates _before_ get the `disabled` class)

### Available actions

- `selectedDate: (date: moment) => void`: When a day was clicked in the calendar
- `addRange: (range: [moment, moment]) => void`: Called when a range needs to be added.
- `updateDate: (newDate: moment) => void`: Called when the active date is changed.

### Click to select dates

```hbs
// template.hbs
{{glimr/inline-calendar
  selectedDates=selectedDates
  selectedDate=(action "alertDate")}}
}}
```

```js
// component.js
import Ember from "ember";

export default Ember.Component.extend({
  selectedDates: Ember.computed(function() {
    return [];
  }),

  actions: {
    alertDate(momentDate) {
      alert(`Select ${moment.format("YYYY-MM-DD")}`);
      this.set("selectedDates", [momentDate]);
    }
  }
});
```

### Select a range of dates

```hbs
// template.hbs
{{glimr/inline-calendar
  clickToRange=true
  ranges=ranges
  addRange=(action "addRange")}}
}}
```

```js
// component.js
import Ember from "ember";

export default Ember.Component.extend({
  ranges: Ember.computed(function() {
    return [];
  }),

  actions: {
    addRange(newRange) {
      this.get("ranges").pushObject(newRange);
    }
  }
});
```

### Only allow this week

```hbs
// template.hbs
{{glimr/inline-calendar
  disabledTo=startOfWeek
  disabledFrom=endOfWeek
  addRange=(action "addRange")}}
}}
```

```js
// component.js
import Ember from "ember";
import moment from "moment";

export default Ember.Component.extend({
  selectedDates: Ember.computed(function() {
    return [];
  }),

  startOfWeek: Ember.computed(function() {
    return moment().startOf("week");
  }),

  endOfWeek: Ember.computed(function() {
    return moment().endOf("week");
  }),

  actions: {
    addDate(newMoment) {
      this.get("selectedDates").pushObject(newMoment);
    }
  }
});
```
