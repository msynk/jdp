jdp.createDaysPanel = function (dp) {
  var d = document.createElement('div');
  d.id = dp.target.id + '_daysPanel';
  d.className = 'jdp jdp-daysPanel';
  if (dp.calendar.rtl) {
    d.className += ' jdp-rtl';
  }
  d.appendChild(jdp.daysPanel.createTable(dp));

  d.show = function () {
    d.style.display = 'block';
  };

  d.hide = function () {
    d.style.display = 'none';
  };

  return d;
};

jdp.daysPanel = {};

jdp.daysPanel.createTable = function (dp) {
  var table = document.createElement('table');
  table.appendChild(jdp.daysPanel.createHeader(dp));
  table.appendChild(jdp.daysPanel.createWeekDays(dp));
  jdp.daysPanel.createDays(dp, table);
  return table;
};

jdp.daysPanel.createHeader = function (dp) {
  var tr = document.createElement('tr'),
    tdPrev = document.createElement('td'),
    tdCenter = document.createElement('td'),
    tdNext = document.createElement('td');

  tdPrev.innerHTML = '&lt;';
  tdPrev.onclick = function () {
    dp.viewDate.addMonth(-1);
    dp.renderDaysPanel();
  }

  tdCenter.innerHTML = dp.calendar.months[dp.viewDate.month - 1] + ' ' + dp.viewDate.year;
  tdCenter.colSpan = (dp.calendar.weekLength - 2);
  tdCenter.onclick = function () {
    dp.hide();
    dp.renderMonthsPanel();
    dp.panels.months.style.display = 'block';
  }

  tdNext.innerHTML = '&gt;';
  tdNext.onclick = function () {
    dp.viewDate.addMonth(1);
    dp.renderDaysPanel();
  }

  tr.appendChild(tdPrev);
  tr.appendChild(tdCenter);
  tr.appendChild(tdNext);
  return tr;
};

jdp.daysPanel.createWeekDays = function (dp) {
  var tr = document.createElement('tr');
  for (var i = 0; i < dp.calendar.weekLength; i++) {
    var td = document.createElement('td');
    td.innerHTML = dp.calendar.weekDays[i];
    tr.appendChild(td);
  }
  return tr;
};

jdp.daysPanel.createDays = function (dp, table) {
  var rows = jdp.daysPanel.generateDaysArray(dp);
  for (var i = 0; i < rows.length; i++) {
    var tr = document.createElement('tr'),
        row = rows[i];
    for (var j = 0; j < row.length; j++) {
      var day = row[j],
        td = document.createElement('td');
      if (day !== '') {
        td.day = day;
        td.onclick = function () {
          var date = dp.viewDate.get(this.day);
          dp.selectedDate = date;
          dp.target.value = dp.selectedDate.toString();
        };
        td.innerHTML = day;

        var date = dp.viewDate.get(day);
        if (date.equals(dp.calendar.today)) {
          td.className += ' jdp-today';
        }
        if (date.equals(dp.selectedDate)) {
          td.className += ' jdp-selected';
        }
      }

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

jdp.daysPanel.generateDaysArray = function (dp) {
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