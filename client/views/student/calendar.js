Template.calendar.helpers({
  calendarWeeks: function() {
    var startDate = Session.get('calStartDate');
    var endDate = Session.get('calEndDate');
    var calendarWeeks = []; 
    startDate = moment(startDate,'ddd[,] MMM D YYYY'); 
    endDate = moment(endDate,'ddd[,] MMM D YYYY').add('days',1); 
    for (date=startDate; startDate.isBefore(endDate); date.add('weeks',1)) {
      calendarWeeks.push({monOfWeek : date.format('ddd[,] MMM D YYYY')});
    };
    $('.daysActivities p').remove(); 
    return calendarWeeks;
  }
});

//removing .daysActivities p be added back from database in calendarDay ... necessary becasue they were not automatically moving with their date in the calendar, but rather staying with the row
