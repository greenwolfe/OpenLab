moment.lang('en', { //overriding calendar formatting from moment.js
    calendar : {
        lastDay : 'ddd[,] MMM D',
        sameDay : '[Today]',
        nextDay : 'ddd[,] MMM D',
        lastWeek : 'ddd[,] MMM D',
        nextWeek : 'ddd[,] MMM D',
        sameElse : 'ddd[,] MMM D'
    }
});

Template.calendarWeek.helpers({
  weekDays: function() {
    var Monday = moment(this.monOfWeek,'ddd[,] MMM D YYYY');
    var Friday = moment(this.monOfWeek,'ddd[,] MMM D YYYY').add('days',4).add('hours',1);
    var weekDays = [];
    for (day = Monday; day.isBefore(Friday); day.add('days',1)) {
      weekDays.push({
        ID: day.format('MMM[_]D[_]YYYY'),
        day: day.calendar()
      });
    };
    return weekDays;
  }           
});
