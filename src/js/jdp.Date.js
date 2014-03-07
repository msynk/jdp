jdp.Date = function (y, m, d, wc, cal) {

  this.daysInMonth = function () {
    this.cal.daysInMonth(this.year, this.month);
  };

  this.clone = function () {
    return new jdp.Date(this.year, this.month, this.day, this.weekDay, this.cal);
  };

  this.get = function (day) {
    return new jdp.Date(this.year, this.month, day, this.cal);
  };

  this.equals = function (date) {
    return (this.year === date.year && this.month === date.month && this.day === date.day && this.cal == date.cal);
  }

  
  this.addMonth = function (m) {
    this.month += m;
    if (this.month < 1) {
      this.month = this.cal.monthNo + this.month;
      this.addYear(-1);
    }

    if (this.month > this.cal.monthNo) {
      this.month = this.month - this.cal.monthNo;
      this.addYear(1);
    }
    //this.findWeekDay();
    this.weekDay = '';
  };
  this.addYear = function (y) {
    this.year += y;
    //this.findWeekDay();
    this.weekDay = '';
  };

  this.setMonth = function (m) {
    this.month = m;
    //this.findWeekDay();
    this.weekDay = '';
  };

  this.setYear = function (y) {
    this.year = y;
    //this.findWeekDay();
    this.weekDay = '';
  };

  this.findFirstDay = function () {
    return this.get(1).findWeekDay();
  };

  this.findWeekDay = function () {
    var diff = this.cal.today.diff(this);
    var wd = this.cal.today.weekDay + diff % this.cal.weekLength;
    if (wd < 0) wd += this.cal.weekLength;
    if (wd > this.cal.weekLength - 1) wd -= this.cal.weekLength;
    this.weekDay = wd;
    return wd;
  };

  this.diff = function (date) {
    var diff = 0,
      inc = 1,
      y1 = this.year, m1 = this.month, d1 = this.day,
      y2 = date.year, m2 = date.month, d2 = date.day;

    if (y1 > y2 || (y1 == y2 && m1 > m2)) {
      y2 = this.year, m2 = this.month, d2 = this.day,
      y1 = date.year, m1 = date.month, d1 = date.day;
      inc = -1;
    }

    while (!(y1 == y2 && m1 == m2)) {
      diff += this.cal.daysInMonth(y1, m1);
      m1++;
      if (m1 > this.cal.monthNo) {
        m1 = 1;
        y1++;
      }
    }
    diff += d2 - d1;
    return inc * diff;
  };

  this.toString = function (format) {
    return this.year + '/' + this.month + '/' + this.day;
  };

  this.parse = function () {

  };


  (function $Init(me) {

    me.year = y;
    me.month = m;
    me.day = d;

    if (typeof wc === 'number') {
      me.weekDay = wc;
      me.cal = cal;
    }
    else {
      me.cal = wc;
      me.findWeekDay();
    }

  })(this);



  // its kinda redundant!
  this.addDay = function (d) {
    this.day += d;
    if (this.day < 1) {
      this.addMonth(-1);
      this.day = this.daysInMonth() + this.day;
    }

    if (this.day > this.daysInMonth()) {
      this.day = this.day - this.daysInMonth();
      this.addMonth(+1);
    }
    this.findWeekDay();
  };
}