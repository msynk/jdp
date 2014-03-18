var jdp = function (target, options) {
  if (this instanceof jdp) {
    throw 'its a function not a constructor.';
  }
  return new jdp.DatePicker(target, options);
};

jdp.DatePicker = function (t, opt) {
  var me = this;
  if (!(me instanceof jdp.DatePicker)) {
    throw 'its a constructor not a function.';
  }
  me.target = t;
  if (typeof t === 'string') {
    me.target = document.getElementById(t);
  }
  if (!me.target) {
    throw 'invalid target';
  }
  me.options = opt || {};

  me.setDates = function () {
    if (!me.target.value) {
      me.selectedDate = me.calendar.today.clone();
    } else {
      me.selectedDate = jdp.Date.parse(me.target.value, me.options.format, me.calendar);
    }
    me.viewDate = me.selectedDate.clone();
  };

  me.setEvents = function () {

    me.target.onclick = function () {
      me.show();
    };

    document.onmousedown = function (e) {
      e = e || window.event;
      var target = e.target;
      var isValidTarget = function (tar) {
        return tar == me.panels.days || tar == me.panels.months || tar == me.panels.years || tar == me.panels.decades;
      };
      if (target == me.target || isValidTarget(target)) return;

      while (target.parentNode) {
        if (isValidTarget(target.parentNode)) return;
        target = target.parentNode;
      }
      me.hide();
    };
  };

  me.show = function () {
    me.setDates();
    me.renderDays();
    me.hide();
    me.panels.days.show();
  };
  me.hide = function () {
    if (me.panels.days) me.panels.days.hide();
    if (me.panels.months) me.panels.months.hide();
    if (me.panels.years) me.panels.years.hide();
    if (me.panels.decades) me.panels.decades.hide();
  };

  me.prepareCalendar = function () {
    var oCal = me.options.calendar;
    me.calendar = jdp.u.extend({}, jdp.calendars['default']);
    if (oCal && jdp.calendars[oCal]) {
      me.calendar = jdp.u.extend(me.calendar, jdp.calendars[oCal]);
    }
    me.calendar.weekLength = me.calendar.weekDays.length;
    me.calendar.monthNo = me.calendar.months.length;
    me.calendar.today = new jdp.Date(me.calendar.today[0], me.calendar.today[1], me.calendar.today[2], me.calendar.today[3], me.calendar);
  };


  (function $Init() {
    if (!me.options.format) {
      me.options.format = jdp.Date.patterns.DefaultPattern;
    }
    me.prepareCalendar();

    me.setEvents();
    me.panels = {};
  })();
};

jdp.DatePicker.prototype.renderDays = function () {
  if (this.panels.days) {
    document.body.removeChild(this.panels.days);
  }
  this.panels.days = jdp.panels.createDays(this);
};
jdp.DatePicker.prototype.renderMonths = function () {
  if (this.panels.months) {
    document.body.removeChild(this.panels.months);
  }
  this.panels.months = jdp.panels.createMonths(this);
};
jdp.DatePicker.prototype.renderYears = function () {
  if (this.panels.years) {
    document.body.removeChild(this.panels.years);
  }
  this.panels.years = jdp.panels.createYears(this);
};
jdp.DatePicker.prototype.renderDecades = function () {
  if (this.panels.decades) {
    document.body.removeChild(this.panels.decades);
  }
  this.panels.decades = jdp.panels.createDecades(this);
};

jdp.calendars = {
  'default': {
    name: 'gregorian',
    lang: 'en',
    title: 'English(Gregorian) Calendar',

    rtl: false,
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    monthsInRow: 4,

    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    daysInMonth: function (year, month) {
      if (month === 2 && this.isLeapYear(year)) return 29;
      return this.monthDays[month - 1];
    },

    today: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getDay()],
  }
};