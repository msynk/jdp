jdp.createMonthsPanel = function (dp) {
  var d = document.createElement('div');
  d.id = dp.target.id + '_monthsPanel';
  d.className = 'jdp jdp-monthsPanel';
  if (dp.calendar.rtl) {
    d.className += ' jdp-rtl';
  }
  d.appendChild(jdp.monthsPanel.createTable(dp));
  return d;
};

jdp.monthsPanel = {};

jdp.monthsPanel.createTable = function (dp) {
  var table = document.createElement('table');
  table.appendChild(jdp.monthsPanel.createHeader(dp));
  jdp.monthsPanel.createMonths(dp, table);
  return table;
};

jdp.monthsPanel.createHeader = function (dp) {
  var tr = document.createElement('tr'),
    tdPrev = document.createElement('td'),
    tdCenter = document.createElement('td'),
    tdNext = document.createElement('td');

  tdPrev.innerHTML = '&lt;';
  tdPrev.onclick = function () {
    dp.viewDate.addYear(-1);
    dp.renderMonthsPanel();
  };

  tdCenter.innerHTML = dp.viewDate.year;
  tdCenter.colSpan = dp.calendar.monthsInRow - 2;
  tdCenter.onclick = function () {
    dp.hide();
    dp.renderYearsPanel();
    dp.panels.years.style.display = 'block';
  };

  tdNext.innerHTML = '&gt;';
  tdNext.onclick = function () {
    dp.viewDate.addYear(1);
    dp.renderMonthsPanel();
  };

  tr.appendChild(tdPrev);
  tr.appendChild(tdCenter);
  tr.appendChild(tdNext);
  return tr;
};

jdp.monthsPanel.createMonths = function (dp, table) {
  var index = 0;
  while (index < dp.calendar.monthNo) {
    var tr = document.createElement('tr');
    for (var i = 0; i < dp.calendar.monthsInRow; i++) {
      var td = document.createElement('td');
      td.innerHTML = dp.calendar.months[index];
      td.month = index + 1;
      td.onclick = function () {
        dp.viewDate.setMonth(this.month);
        dp.panels.months.style.display = 'none';
        dp.renderDaysPanel();
      };
      tr.appendChild(td);
      index++;
    }
    table.appendChild(tr);
  }
};