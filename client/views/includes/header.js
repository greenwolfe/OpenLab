Template.header.helpers({
  group : function () {
    var eventID = Session.get("currentEventID");
    calendarEvent = CalendarEvents.findOne(eventID);
    if (!calendarEvent) return [];    
    return calendarEvent.group;
  },
  activity : function() { // should be a way to do this with the router and not by calling window.location
    var path = window.location.pathname.split("/");
    if (path[1] == "activity") {
      return Activities.findOne(path[2]);
    } else {
      return "";
    }; 
  }
});

Template.header.events({
  'click .brand' : function () {
    Session.set("currentEventID","");
  }
});
