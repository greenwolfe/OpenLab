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

Template.calendar.rendered = function(){
  var MonThisWeek = moment().day("Monday").format('ddd[,] MMM D YYYY');
  var MonNextWeek = moment().day("Monday").add('weeks',1).format('ddd[,] MMM D YYYY');
  Session.setDefault('calStartDate',MonThisWeek);
  Session.setDefault('calEndDate',MonNextWeek);
  var startDate = Session.get('calStartDate');
  var endDate = moment(Session.get('calEndDate'),'ddd[,] MMM D YYYY').day("Friday").format('ddd[,] MMM D YYYY');

  $('#startDate').datepicker(DateOpt('calStartDate')).datepicker('setDate', startDate);
  $('#endDate').datepicker(DateOpt('calEndDate')).datepicker('setDate', endDate);
};

var DateOpt = function(sessionKey) { //default datepicker options
  var onSelect = function(dateText,Object){
    Monday = moment(dateText,'ddd[,] MMM D YYYY').day("Monday");
    Monday = Monday.format('ddd[,] MMM D YYYY');
    Session.set(sessionKey,Monday); //Meteor takes care of not invalidating templates and causing re-rendering if the key is set to an identical value, and therefore not changed
  };
  var that = {
    dateFormat:'D, M dd yy',
    onSelect: onSelect
  };
  return that;
};

//removing .daysActivities p be added back from database in calendarDay ... necessary becasue they were not automatically moving with their date in the calendar, but rather staying with the row
