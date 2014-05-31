/*Template.calendar.helpers({
  calendarWeeks: function() {
    var startDate = Session.get('calStartDate');
    var endDate = Session.get('calEndDate');
    var calendar = document.getElementById('calendar');
    var calendarWeeks, weeks, n; 
    startDate = moment(startDate,'ddd[,] MMM D YYYY').day("Monday");
    endDate = moment(endDate,'ddd[,] MMM D YYYY').day("Monday");
    if (calendar) { //prepend/append to table or delete rows
      weeks = calendar.getElementsByTagName("tr");
      firstWeek = moment(weeks[0].id,'ddd[,] MMM D YYYY');
      lastWeek = moment(weeks[weeks.length-1].id,'ddd[,] MMM D YYYY');
      n = firstWeek.diff(startDate,'weeks');
      if (n > 0) { //prepend (therefore not appending)
        while (n > 0) {
          $(calendar).prepend(
        }
      } else if (n < 0) { //delete

      };
        
      weeks = endDate.diff(startDate,'weeks');
      calendarWeeks = [{monOfWeek : startDate.format('ddd[,] MMM D YYYY')}]
      for (week = 1; week <= weeks; week++) {
        calendarWeeks.push({monOfWeek : startDate.add("weeks",1).format('ddd[,] MMM D YYYY')}); 
      };
    } else {   //create table
      weeks = endDate.diff(startDate,'weeks');
      calendarWeeks = [{monOfWeek : startDate.format('ddd[,] MMM D YYYY')}]
      for (week = 1; week <= weeks; week++) {
        calendarWeeks.push({monOfWeek : startDate.add("weeks",1).format('ddd[,] MMM D YYYY')}); 
      };
    };
    return calendarWeeks;

  }
}); */

Template.calendar.rendered = function() {
    var startDate = Session.get('calStartDate');
    var endDate = Session.get('calEndDate');
    var calendar = document.getElementById('calendar');
    var calendarWeeks, weeks, ID; 
    console.log('in calendar.rendered');
    startDate = moment(startDate,'ddd[,] MMM D YYYY').day("Monday");
    endDate = moment(endDate,'ddd[,] MMM D YYYY').day("Monday");
    weeks = endDate.diff(startDate,'weeks');
    while (weeks >= 0) {
      ID = startDate.format('ddd[,] MMM D YYYY');
      this.monOfWeek = ID;
      $(calendar).append("  <tr id = " + ID + " > {{#each weekDays}} {{> calendarDay}} {{/each}} </tr>");
      startDate.add("weeks",1);
      weeks--
    };
};

/*    weeks = endDate.diff(startDate,'weeks');
    calendarWeeks = [{monOfWeek : startDate.format('ddd[,] MMM D YYYY')}]
    for (week = 1; week <= weeks; week++) {
      calendarWeeks.push({monOfWeek : startDate.add("weeks",1).format('ddd[,] MMM D YYYY')}); 
    }; */
