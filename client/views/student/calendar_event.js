Template.calendarEvent.events({
  'click .remove': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var calendarEvent;
    CalendarEvents.update(eventID,{$pull: {group : Meteor.userId()}});
    CalendarEvents.update(eventID,{$addToSet: {invite : Meteor.userId()}}); 
    calendarEvent = CalendarEvents.findOne(eventID); 
    if (calendarEvent.group.length == 0) {
      CalendarEvents.remove(eventID);
    } 
   }
});



