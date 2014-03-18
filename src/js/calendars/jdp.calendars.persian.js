jdp.calendars['persian'] = {
  name: 'persian',
  lang: 'fa-IR',
  title: 'Persian(Jalali) Calendar',

  rtl: true,
  weekDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  abbrWeekDays: ['شن', 'یک', 'دو', 'سه', 'چه', 'پن', 'جم'],
  months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
  abbrMonths: ['فر', 'ار', 'خر', 'تی', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
  monthDays: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
  monthsInRow: 3,
  isLeapYear: function (year) {
    // came from .Net Framework System.Globalization.PersianCalendar class:
    var leapYears33 = [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0];
    return (leapYears33[year % 33] === 1);
  },
  daysInMonth: function (year, month) {
    if (month === 12 && this.isLeapYear(year)) return 30;
    return this.monthDays[month - 1];
  },
  separator:'/',

  today: [1392, 12, 7, 4], // چهارشنبه 7 اسفند 1392 - روز آغاز نوشتن این کتابخانه
};