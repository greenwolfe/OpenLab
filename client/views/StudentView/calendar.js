var firstCalendarWeek = 0;
var weeksInCalendar = 2;
var calendarWeeks = [];
for (week = firstCalendarWeek; week < firstCalendarWeek + weeksInCalendar; week++) {
  calendarWeeks.push({ week : week });
}
Template.calendar.helpers({
  calendarWeeks: calendarWeeks
});
