jdp.calendars = {
  'default': {
    code: 'fa-IR',
    name: 'Persian Calendar',
    rtl: true,
    weekDays: ['شن', 'یک', 'دو', 'سه', 'چه', 'پن', 'جم'],
    months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
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

    today: [1392, 12, 7, 4],
  }
};