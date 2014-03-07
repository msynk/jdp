jdp.calendars = {
  'default': {
    name: 'gregorian',
    lang: 'en',
    title: 'English(Gregorian) Calendar',

    rtl: false,
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    monthsInRow: 3,

    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    daysInMonth: function (year, month) {
      if (month === 2 && this.isLeapYear(year)) return 29;
      return this.monthDays[month - 1];
    },

    today: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getDay()],
  }
};