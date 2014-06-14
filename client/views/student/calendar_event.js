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
   },
  'click a': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    Session.set('currentEventID',eventID);
  }
});

Template.calendarEvent.helper({
  group: function() {
    //var eventID = $(event.currentTarget.parentElement).data('eventid');
    console.log(this.group);
    return this.group;
  }
});



