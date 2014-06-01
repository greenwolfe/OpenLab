/*Template.calendar.helpers({
  calendarWeeks: function() {
    var startDate = Session.get('calStartDate');
    var endDate = Session.get('calEndDate');
    var calendarWeeks, weeks; 
    startDate = moment(startDate,'ddd[,] MMM D YYYY'); //.day("Monday");
    calendarWeeks = [{monOfWeek : startDate.format('ddd[,] MMM D YYYY')}]
    endDate = moment(endDate,'ddd[,] MMM D YYYY'); //.day("Monday");
    weeks = endDate.diff(startDate,'weeks');
    for (week = 1; week <= weeks; week++) {
      calendarWeeks.push({monOfWeek : startDate.add("weeks",1).format('ddd[,] MMM D YYYY')}); 
    };
    return calendarWeeks;
  }
}); */


Template.calendar.rendered = function(){
    var startDate = moment().day("Monday");
    var endDate = moment().day("Monday").add('days',8); 
    for (date = startDate;date.isBefore(endDate);date.add('weeks',1)) {
      this.monOfWeek = date.format('ddd[,] MMM D YYYY');
      $('#calendar').append('{{> calendarWeek}}');
    }
};


