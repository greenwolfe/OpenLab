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
                var week = this.week;
                var day = moment().day("Monday").add('weeks',week);
                var weekDays = [{
                        day: day,
                        dayString: day.calendar()
                  }];
                for (i = 0; i < 4; i++) {
                  day.add('days',1);
		  weekDays.push({
                        day: day.format('YYYY MM DD'),
                        dayString: day.calendar()
                  })
                };
                return weekDays;
            }           
});
