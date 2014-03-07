﻿var jdp = function (target, options) {
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
    me.renderDaysPanel();
    me.hide();
    me.panels.days.show();
  };
  me.hide = function () {
    if (me.panels.days) me.panels.days.hide();
    if (me.panels.months) me.panels.months.hide();
    if (me.panels.years) me.panels.years.hide();
    if (me.panels.decades) me.panels.decades.hide();
  };


  (function $Init() {
    var oCal = me.options.calendar;
    me.calendar = jdp.u.extend({}, jdp.calendars['default']);
    if (oCal && jdp.calendars[oCal]) {
      me.calendar = jdp.u.extend(me.calendar, jdp.calendars[oCal]);
    }
    me.calendar.weekLength = me.calendar.weekDays.length;
    me.calendar.monthNo = me.calendar.months.length;
    me.calendar.today = new jdp.Date(me.calendar.today[0], me.calendar.today[1], me.calendar.today[2], me.calendar.today[3], me.calendar);

    me.top = me.target.offsetTop + me.target.offsetHeight + 'px';
    me.left = me.target.offsetLeft + 'px';

    me.setEvents();
    me.panels = {};
  })();
};

jdp.DatePicker.prototype.renderDaysPanel = function () {
  if (this.panels.days) {
    document.body.removeChild(this.panels.days);
  }
  this.panels.days = jdp.panels.createDays(this);
};
jdp.DatePicker.prototype.renderMonthsPanel = function () {
  if (this.panels.months) {
    document.body.removeChild(this.panels.months);
  }
  this.panels.months = jdp.panels.createMonths(this);
};
jdp.DatePicker.prototype.renderYearsPanel = function () {
  if (this.panels.years) {
    document.body.removeChild(this.panels.years);
  }
  this.panels.years = jdp.panels.createYears(this);
};
jdp.DatePicker.prototype.renderDecadesPanel = function () {
  if (this.panels.decades) {
    document.body.removeChild(this.panels.decades);
  }
  this.panels.decades = jdp.panels.createDecades(this);
};