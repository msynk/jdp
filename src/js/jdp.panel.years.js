jdp.createYearsPanel = function (dp) {
  var d = document.createElement('div');
  d.id = dp.target.id + '_yearsPanel';
  d.className = 'jdp jdp-yearsPanel';
  if (dp.calendar.rtl) {
    d.className += ' jdp-rtl';
  }
  d.appendChild(jdp.yearsPanel.createTable(dp));
  return d;
};

jdp.yearsPanel = {};

jdp.yearsPanel.createTable = function (dp) {
  var table = document.createElement('table');
  var startYear = dp.viewDate.year - dp.viewDate.year % 10;
  table.appendChild(jdp.yearsPanel.createHeader(dp, startYear));
  jdp.yearsPanel.createYears(dp, table, startYear);
  return table;
};

jdp.yearsPanel.createHeader = function (dp, startYear) {
  var tr = document.createElement('tr'),
    tdPrev = document.createElement('td'),
    tdCenter = document.createElement('td'),
    tdNext = document.createElement('td');

  tdPrev.innerHTML = '&lt;';
  tdPrev.onclick = function () {
    dp.viewDate.addYear(-10);
    dp.renderYearsPanel();
  };

  tdCenter.innerHTML = startYear + ' - ' + (startYear + 9);
  tdCenter.style.direction = 'ltr';
  tdCenter.onclick = function () {
    dp.hide();
    dp.renderDecadesPanel();
    dp.panels.decades.style.display = 'block';
  };

  tdNext.innerHTML = '&gt;';
  tdNext.onclick = function () {
    dp.viewDate.addYear(10);
    dp.renderYearsPanel();
  };

  tr.appendChild(tdPrev);
  tr.appendChild(tdCenter);
  tr.appendChild(tdNext);
  return tr;
};

jdp.yearsPanel.createYears = function (dp, table, startYear) {
  for (var year = startYear; year < startYear + 10;) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 3 && year < startYear + 10; j++) {
      var td = document.createElement('td');
      td.innerHTML = year;
      td.year = year;
      td.onclick = function () {
        dp.viewDate.setYear(this.year);
        dp.panels.years.style.display = 'none';
        dp.renderMonthsPanel();
      };
      tr.appendChild(td);
      year++;
    }
    table.appendChild(tr);
  }
};