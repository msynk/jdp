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
  };


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
    return this._toFormattedString(format);
  };

  (function $Init(me) {

    me.year = y;
    me.month = m;
    me.day = d;

    if (typeof wc === 'number') {
      me.weekDay = wc;
      me.cal = cal;
    } else {
      me.cal = wc;
      if (me.cal.today instanceof Array) {
        me.cal.today = new jdp.Date(me.cal.today[0], me.cal.today[1], me.cal.today[2], me.cal.today[3], me.cal);
      }
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
};
jdp.Date.prototype._toFormattedString = function (format) {
  if (!format || !format.length || (format === 'i')) {
    format = "F";
  }
  format = jdp.Date._expandFormat(format);
  var cal = this.cal,
    ret = new jdp.u.StringBuilder();

  function addLeadingZero(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

  function padYear(year) {
    if (year < 10) {
      return '000' + year;
    } else if (year < 100) {
      return '00' + year;
    } else if (year < 1000) {
      return '0' + year;
    }
    return year.toString();
  }

  var foundDay;
  var quoteCount = 0,
    tokenRegExp = jdp.Date._getTokenRegExp();
  for (; ;) {
    var index = tokenRegExp.lastIndex;
    var ar = tokenRegExp.exec(format);
    var preMatch = format.slice(index, ar ? ar.index : format.length);
    quoteCount += jdp.Date._appendPreOrPostMatch(preMatch, ret);
    if (!ar) break;
    if ((quoteCount % 2) === 1) {
      ret.append(ar[0]);
      continue;
    }

    function getPart(date, part) {
      switch (part) {
        case 0:
          return date.year;
        case 1:
          return date.month;
        case 2:
          return date.day;
        default:
          return null;
      }
    }

    switch (ar[0]) {
      case "dddd":
        ret.append(cal.weekDays[this.weekDay - 1]);
        break;
      case "ddd":
        ret.append(cal.abbrWeekDays[this.weekDay - 1]);
        break;
      case "dd":
        foundDay = true;
        ret.append(addLeadingZero(getPart(this, 2)));
        break;
      case "d":
        foundDay = true;
        ret.append(getPart(this, 2));
        break;
      case "MMMM":
        ret.append(cal.months[getPart(this, 1)]);
        break;
      case "MMM":
        ret.append(cal.abbrMonths[getPart(this, 1)]);
        break;
      case "MM":
        ret.append(addLeadingZero(getPart(this, 1)));
        break;
      case "M":
        ret.append(getPart(this, 1));
        break;
      case "yyyy":
        ret.append(padYear(this.year));
        break;
      case "yy":
        ret.append(addLeadingZero(this.yeaer % 100));
        break;
      case "y":
        ret.append(this.year % 100);
        break;
      case "/":
        ret.append(cal.separator);
        break;
      default:
        throw "jdp.Date: Invalid date format pattern";
    }
  }
  return ret.toString();
};

jdp.Date.patterns = {
  "DefaultPattern": "yyyy/MM/dd",
  "FullDateTimePattern": "dddd, MMMM dd, yyyy h:mm:ss tt",
  "LongDatePattern": "dddd, MMMM dd, yyyy",
  "LongTimePattern": "h:mm:ss tt",
  "MonthDayPattern": "MMMM dd",
  "PMDesignator": "PM",
  "RFC1123Pattern": "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'",
  "ShortDatePattern": "MM/dd/yyyy",
  "ShortTimePattern": "HH:mm",
  "SortableDateTimePattern": "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss",
  "TimeSeparator": ":",
  "UniversalSortableDateTimePattern": "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'",
  "YearMonthPattern": "yyyy MMMM"
};
jdp.Date.parse = function (value, format, cal) {
  value = value.trim();
  var parseInfo = jdp.Date._getParseRegExp(format, cal),
      match = new RegExp(parseInfo.regExp).exec(value);
  if (match === null) return null;

  var groups = parseInfo.groups,
      year = null, month = null, day = null;
  for (var j = 0, jl = groups.length; j < jl; j++) {
    var matchGroup = match[j + 1];
    if (!matchGroup) continue;

    switch (groups[j]) {
      case 'dd':
      case 'd':
        day = parseInt(matchGroup, 10);
        if ((day < 1) || (day > 31)) return null;
        break;
      case 'MMMM':
        month = matchGroup;
        break;
      case 'MMM':
        month = matchGroup;
        break;
      case 'M':
      case 'MM':
        month = parseInt(matchGroup, 10);
        break;
      case 'y':
      case 'yy':
        year = matchGroup;
        break;
      case 'yyyy':
        year = parseInt(matchGroup, 10);
        break;
    }
  }
  return new jdp.Date(year, month, day, cal);
};
jdp.Date._getParseRegExp = function (format, cal) {
  var expFormat = jdp.Date._expandFormat(format);
  expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
  var regexp = new jdp.u.StringBuilder("^"),
    groups = [],
    index = 0,
    quoteCount = 0,
    tokenRegExp = jdp.Date._getTokenRegExp(),
    match;
  while ((match = tokenRegExp.exec(expFormat)) !== null) {
    var preMatch = expFormat.slice(index, match.index);
    index = tokenRegExp.lastIndex;
    quoteCount += jdp.Date._appendPreOrPostMatch(preMatch, regexp);
    if ((quoteCount % 2) === 1) {
      regexp.append(match[0]);
      continue;
    }
    switch (match[0]) {
      case 'dddd':
      case 'ddd':
      case 'MMMM':
      case 'MMM':
      case 'gg':
      case 'g':
        regexp.append("(\\D+)");
        break;
      case 'tt':
      case 't':
        regexp.append("(\\D*)");
        break;
      case 'yyyy':
        regexp.append("(\\d{4})");
        break;
      case 'fff':
        regexp.append("(\\d{3})");
        break;
      case 'ff':
        regexp.append("(\\d{2})");
        break;
      case 'f':
        regexp.append("(\\d)");
        break;
      case 'dd':
      case 'd':
      case 'MM':
      case 'M':
      case 'yy':
      case 'y':
      case 'HH':
      case 'H':
      case 'hh':
      case 'h':
      case 'mm':
      case 'm':
      case 'ss':
      case 's':
        regexp.append("(\\d\\d?)");
        break;
      case 'zzz':
        regexp.append("([+-]?\\d\\d?:\\d{2})");
        break;
      case 'zz':
      case 'z':
        regexp.append("([+-]?\\d\\d?)");
        break;
      case '/':
        regexp.append("(\\" + cal.separator + ")");
        break;
      default:
        throw "Invalid date format pattern";
    }
    groups[groups.length] = match[0];
  }
  jdp.Date._appendPreOrPostMatch(expFormat.slice(index), regexp);
  regexp.append("$");
  var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
  var parseRegExp = { 'regExp': regexpStr, 'groups': groups };
  return parseRegExp;
};
jdp.Date._expandFormat = function (format) {
  if (!format) {
    format = "F";
  }
  var len = format.length;
  if (len === 1) {
    switch (format) {
      case "d":
        return jdp.Date.patterns.ShortDatePattern;
      case "D":
        return jdp.Date.patterns.LongDatePattern;
      case "t":
        return jdp.Date.patterns.ShortTimePattern;
      case "T":
        return jdp.Date.patterns.LongTimePattern;
      case "f":
        return jdp.Date.patterns.LongDatePattern + " " + jdp.Date.patterns.ShortTimePattern;
      case "F":
        return jdp.Date.patterns.FullDateTimePattern;
      case "M":
      case "m":
        return jdp.Date.patterns.MonthDayPattern;
      case "s":
        return jdp.Date.patterns.SortableDateTimePattern;
      case "Y":
      case "y":
        return jdp.Date.patterns.YearMonthPattern;
      default:
        throw "jdp.Date: Invalid format String.";
    }
  } else if ((len === 2) && (format.charAt(0) === "%")) {
    format = format.charAt(1);
  }
  return format;
};
jdp.Date._getTokenRegExp = function () {
  return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
jdp.Date._appendPreOrPostMatch = function (preMatch, strBuilder) {
  var quoteCount = 0;
  var escaped = false;
  for (var i = 0, il = preMatch.length; i < il; i++) {
    var c = preMatch.charAt(i);
    switch (c) {
      case '\'':
        if (escaped) strBuilder.append("'");
        else quoteCount++;
        escaped = false;
        break;
      case '\\':
        if (escaped) strBuilder.append("\\");
        escaped = !escaped;
        break;
      default:
        strBuilder.append(c);
        escaped = false;
        break;
    }
  }
  return quoteCount;
};