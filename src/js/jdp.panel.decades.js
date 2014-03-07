jdp.createDecadesPanel = function (dp) {
  var d = document.createElement('div');
  d.id = dp.target.id + '_decadesPanel';
  d.className = 'jdp jdp-decadesPanel';
  if (dp.calendar.rtl) {
    d.className += ' jdp-rtl';
  }
  d.appendChild(jdp.decadesPanel.createTable(dp));
  return d;
};

jdp.decadesPanel = {};

jdp.decadesPanel.createTable = function (dp) {
  var table = document.createElement('table');
  var startDecade = (dp.viewDate.year - dp.viewDate.year % 100);
  table.appendChild(jdp.decadesPanel.createHeader(dp, startDecade));
  jdp.decadesPanel.createDecades(dp, table, startDecade);
  return table;
};

jdp.decadesPanel.createHeader = function (dp, startDecade) {
  var tr = document.createElement('tr'),
    tdPrev = document.createElement('td'),
    tdCenter = document.createElement('td'),
    tdNext = document.createElement('td');

  tdPrev.innerHTML = '&lt;';
  tdPrev.onclick = function () {
    dp.viewDate.addYear(-100);
    dp.renderDecadesPanel();
  };

  tdCenter.innerHTML = startDecade + ' - ' + (startDecade + 99);
  tdCenter.style.direction = 'ltr';
  tdCenter.onclick = function () {
    //dp.hide();
    //dp.renderDecadesPanel();
    //dp.panels.decades.style.display = 'block';
  };

  tdNext.innerHTML = '&gt;';
  tdNext.onclick = function () {
    dp.viewDate.addYear(100);
    dp.renderDecadesPanel();
  };

  tr.appendChild(tdPrev);
  tr.appendChild(tdCenter);
  tr.appendChild(tdNext);
  return tr;
};

jdp.decadesPanel.createDecades = function (dp, table, startDecade) {
  for (var decade = startDecade; decade < startDecade + 100;) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 3 && decade < startDecade + 100; j++) {
      var td = document.createElement('td');
      td.innerHTML = decade + ' - ' + (decade + 9);
      td.decade = decade;
      td.onclick = function () {
        dp.viewDate.setYear(this.decade);
        dp.panels.decades.style.display = 'none';
        dp.renderYearsPanel();
      };
      tr.appendChild(td);
      decade += 10;
    }
    table.appendChild(tr);
  }
};