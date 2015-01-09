jdp.panels = {};
jdp.panels.createDays = function (dp) {
  var prev = function () {
    dp.viewDate.addMonth(-1);
    dp.renderDays();
  };
  var center = function () {
    dp.hide();
    dp.renderMonths();
    dp.panels.months.show();
  };
  var next = function () {
    dp.viewDate.addMonth(1);
    dp.renderDays();
  };
  var headerText = dp.calendar.months[dp.viewDate.month - 1] + ' ' + dp.viewDate.year;
  var headerColSpan = dp.calendar.weekLength;
  return jdp.panels.create(dp, 'days', [[prev, center, next], headerText, headerColSpan], jdp.panels.days.createWeekDays, jdp.panels.days.createDays);
};
jdp.panels.createMonths = function (dp) {
  var prev = function () {
    dp.viewDate.addYear(-1);
    dp.renderMonths();
  };
  var center = function () {
    dp.hide();
    dp.renderYears();
    dp.panels.years.show();
  };
  var next = function () {
    dp.viewDate.addYear(1);
    dp.renderMonths();
  };
  var headerText = dp.viewDate.year;
  var headerColSpan = dp.calendar.monthsInRow;
  return jdp.panels.create(dp, 'months', [[prev, center, next], headerText, headerColSpan], null, jdp.panels.months.createMonths);
};
jdp.panels.createYears = function (dp) {
  var prev = function () {
    dp.viewDate.addYear(-10);
    dp.renderYears();
  };
  var center = function () {
    dp.hide();
    dp.renderDecades();
    dp.panels.decades.show();
  };
  var next = function () {
    dp.viewDate.addYear(10);
    dp.renderYears();
  };
  var startYear = dp.viewDate.year - dp.viewDate.year % 10;
  var headerText = startYear + ' - ' + (startYear + 9);
  var headerColSpan = 4;
  return jdp.panels.create(dp, 'years', [[prev, center, next], headerText, headerColSpan], null, jdp.panels.years.createYears);
};
jdp.panels.createDecades = function (dp) {
  var prev = function () {
    dp.viewDate.addYear(-100);
    dp.renderDecades();
  };
  var center = function () {
    //dp.hide();
    //dp.renderDecades();
    //dp.panels.decades.show();
  };
  var next = function () {
    dp.viewDate.addYear(100);
    dp.renderDecades();
  };
  var startDecade = (dp.viewDate.year - dp.viewDate.year % 100);
  var headerText = startDecade + ' - ' + (startDecade + 99);
  var headerColSpan = 4;
  return jdp.panels.create(dp, 'decades', [[prev, center, next], headerText, headerColSpan], null, jdp.panels.decades.createDecades);
};

jdp.panels.create = function (dp, panel, head, middle, body) {
  var div = jdp.panels.createDiv(panel, dp);
  var table = jdp.panels.createTable();
  table.appendChild(jdp.panels.createHeader(head[0], head[1], head[2]));
  if (middle) table.appendChild(middle(dp));
  body(dp, table);
  div.appendChild(table);
  document.body.appendChild(div);
  return div;
};
jdp.panels.createDiv = function (panel, dp) {
  var d = document.createElement('div');
  d.id = dp.target.id + '_panels_' + panel;
  d.className = 'jdp jdp-panels-' + panel;
  if (dp.calendar.rtl) {
    d.className += ' jdp-rtl';
  }

  d.show = function () {
    d.style.display = 'block';
    jdp.panels.setLocation(d, dp);
  };

  d.hide = function () {
    d.style.display = 'none';
  };

  return d;
};
jdp.panels.createTable = function () {
  var table = document.createElement('table');
  return table;
};
jdp.panels.createHeader = function (funcs, text, colSpan) {
  var mainTr = document.createElement('tr'),
    mainTd = document.createElement('td'),
    table = document.createElement('table'),
    tr = document.createElement('tr'),
    tdPrev = document.createElement('td'),
    tdCenter = document.createElement('td'),
    tdNext = document.createElement('td');

  tdPrev.innerHTML = '«';
  tdPrev.className = 'prev';
  tdPrev.onclick = funcs[0];

  tdCenter.innerHTML = text;
  tdCenter.className = 'center';
  tdCenter.style.direction = 'ltr';
  tdCenter.onclick = funcs[1];

  tdNext.innerHTML = '»';
  tdNext.className = 'next';
  tdNext.onclick = funcs[2];

  tr.appendChild(tdPrev);
  tr.appendChild(tdCenter);
  tr.appendChild(tdNext);
  tr.className = 'jdp-panels-header';

  table.appendChild(tr);
  mainTd.colSpan = colSpan;
  mainTd.style.padding = 0;
  mainTd.appendChild(table);
  mainTr.appendChild(mainTd);

  return mainTr;
};
jdp.panels.setLocation = function (div, dp) {
  var scrollTop = document.body.scrollTop,
    wSize = jdp.u.getWindowSize(),
    windowSize = {
      width: wSize[0],
      height: wSize[1]
    },
    //target = {
    //  top: dp.target.offsetTop,
    //  left: dp.target.offsetLeft,
    //  height: dp.target.offsetHeight,
    //  width: dp.target.offsetWidth
    //},
    //-------------------------------------
    //rect = dp.target.getBoundingClientRect(),
    //target = {
    //  top: rect.top,
    //  left: rect.left,
    //  height: rect.height,
    //  width: rect.width
    //},
    elOffset = jdp.u.getOffset(dp.target),
    target = {
      top: elOffset.top,
      left: elOffset.left,
      height: dp.target.offsetHeight,
      width: dp.target.offsetWidth
    },
    panel = {
      width: div.offsetWidth,
      height: div.offsetHeight
    },
    top = target.top,
    left = target.left;

  if (dp.calendar.rtl === true) {
    left -= panel.width - target.width;
    if (left > windowSize.width) {
      left -= left - windowSize.width;
    } else if (left < 0) {
      left = 0;
    }
  } else {
    if (target.left < 0) {
      left -= target.left;
    } else if (target.left + panel.width > windowSize.width) {
      left = windowSize.width - panel.width;
    }
  }

  var topOverflow = -scrollTop + target.top - panel.height;
  var bottomOverflow = scrollTop + windowSize.height - (target.top + target.height + panel.height);
  if (Math.max(topOverflow, bottomOverflow) === bottomOverflow) {
    top += target.height;
  } else {
    top -= panel.height;
  }

  div.style.top = top + 'px';
  div.style.left = left + 'px';
};

jdp.panels.days = {};
jdp.panels.days.createWeekDays = function (dp) {
  var tr = document.createElement('tr');
  tr.className = 'jdp-panels-weekday';
  for (var i = 0; i < dp.calendar.weekLength; i++) {
    var td = document.createElement('td');
    td.innerHTML = dp.calendar.abbrWeekDays[i];
    tr.appendChild(td);
  }
  return tr;
};
jdp.panels.days.createDays = function (dp, table) {
  var rows = jdp.panels.days.generateDaysArray(dp);
  for (var i = 0; i < rows.length; i++) {
    var tr = document.createElement('tr'),
        row = rows[i];
    for (var j = 0; j < row.length; j++) {
      var day = row[j],
        td = document.createElement('td');
      if (day !== '') {
        td.day = day;
        td.innerHTML = day;
        td.className = 'day';
        td.onclick = function () {
          if (dp.selectedCellDay) {
            dp.selectedCellDay.className = dp.selectedCellDay.className.replace('jdp-selected', '');
          }
          this.className = 'jdp-selected ' + this.className;
          dp.selectedCellDay = this;
          var date = dp.viewDate.get(this.day);
          dp.selectedDate = date;
          dp.target.value = dp.selectedDate.toString(dp.options.format);
        };

        var date = dp.viewDate.get(day);
        if (date.equals(dp.calendar.today)) {
          td.className += ' jdp-today';
        }
        if (date.equals(dp.selectedDate)) {
          td.className += ' jdp-selected';
          dp.selectedCellDay = td;
        }
      }

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};
jdp.panels.days.generateDaysArray = function (dp) {
  var arr = [];
  arr[0] = [];
  var firstDay = dp.viewDate.findFirstDay();
  var index = 1;
  for (var i = 0; i < dp.calendar.weekLength; i++) {
    arr[0][i] = ((i < firstDay) ? '' : index++);
  }
  var r = 1;
  var daysInMonth = dp.calendar.daysInMonth(dp.viewDate.year, dp.viewDate.month);
  while (index <= daysInMonth) {
    arr[r] = [];
    for (i = 0; i < dp.calendar.weekLength; i++) {
      arr[r][i] = (index > daysInMonth) ? '' : index++;
    }
    r++;
  }
  return arr;
};

jdp.panels.months = {};
jdp.panels.months.createMonths = function (dp, table) {
  var index = 0;
  while (index < dp.calendar.monthNo) {
    var tr = document.createElement('tr');
    for (var i = 0; i < dp.calendar.monthsInRow; i++) {
      var td = document.createElement('td');
      td.className = 'month';
      td.innerHTML = dp.calendar.abbrMonths[index];
      td.month = index + 1;
      td.onclick = function () {
        dp.viewDate.setMonth(this.month);
        dp.panels.months.hide();
        dp.renderDays();
      };

      if (dp.viewDate.year === dp.calendar.today.year && td.month === dp.calendar.today.month) {
        td.className += ' jdp-today';
      }
      if (dp.viewDate.year === dp.selectedDate.year && td.month === dp.selectedDate.month) {
        td.className += ' jdp-selected';
      }

      tr.appendChild(td);
      index++;
    }
    table.appendChild(tr);
  }
};

jdp.panels.years = {};
jdp.panels.years.createYears = function (dp, table) {
  var startYear = dp.viewDate.year - dp.viewDate.year % 10;
  var endYear = startYear + 10;
  for (var year = startYear; year < endYear;) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 4 && year < endYear; j++) {
      if (year === startYear) {
        tr.appendChild(jdp.panels.years.createTd(year - 1, 'year disabled', dp));
        j++;
      }
      tr.appendChild(jdp.panels.years.createTd(year, 'year', dp));
      year++;
    }
    if (year === endYear) {
      tr.appendChild(jdp.panels.years.createTd(year, 'year disabled', dp));
    }
    table.appendChild(tr);
  }
};
jdp.panels.years.createTd = function (year, cls, dp) {
  var td = document.createElement('td');
  td.innerHTML = year;
  td.year = year;
  td.className = cls;
  td.onclick = function () {
    dp.viewDate.setYear(this.year);
    dp.panels.years.hide();
    dp.renderMonths();
  };

  if (year === dp.calendar.today.year) {
    td.className += ' jdp-today';
  }
  if (year === dp.selectedDate.year) {
    td.className += ' jdp-selected';
  }
  return td;
};

jdp.panels.decades = {};
jdp.panels.decades.createDecades = function (dp, table) {
  var startDecade = (dp.viewDate.year - dp.viewDate.year % 100);
  var endDecade = startDecade + 100;
  for (var decade = startDecade; decade < endDecade;) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 4 && decade < endDecade; j++) {
      if (decade === startDecade) {
        tr.appendChild(jdp.panels.decades.createTd(decade - 10, 'decade disabled', dp));
        j++;
      }

      tr.appendChild(jdp.panels.decades.createTd(decade, 'decade', dp));
      decade += 10;
    }
    if (decade === endDecade) {
      tr.appendChild(jdp.panels.decades.createTd(decade, 'decade disabled', dp));
    }
    table.appendChild(tr);
  }
};
jdp.panels.decades.createTd = function (decade, cls, dp) {
  var td = document.createElement('td');
  td.innerHTML = decade + '-' + (decade + 9);
  td.decade = decade;
  td.className = cls;
  td.onclick = function () {
    dp.viewDate.setYear(this.decade);
    dp.panels.decades.hide();
    dp.renderYears();
  };

  if (decade <= dp.calendar.today.year && dp.calendar.today.year <= decade + 9) {
    td.className += ' jdp-today';
  }
  if (decade <= dp.selectedDate.year && dp.selectedDate.year <= decade + 9) {
    td.className += ' jdp-selected';
  }
  return td;
};