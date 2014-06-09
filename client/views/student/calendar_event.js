Template.calendarEvent.events({
  'click .remove': function(event) {
      var eventID = $(event.currentTarget.parentElement).data('eventid');
      CalendarEvents.remove(eventID);
   }
});
