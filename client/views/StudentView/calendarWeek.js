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

Template.calendar.helpers({ //took out calendarWeeks 
  weekDays: function() {
                var day = moment(this.monOfWeek,'ddd[,] MMM D YYYY');
                var weekDays = [];
                var i = 0;
                while (i < 5) {
		  weekDays.push({
                        ID: day.format('MMMDYYYY'),
                        day: day.calendar()
                  })
                  day.add('days',1);
                  i++;
                };
                return weekDays;
            }           
});
