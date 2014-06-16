Template.calendarEvent.rendered = function() {
  $(this.find('p')).droppable(DropOpt());
}; 

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
    var calendarEvent = CalendarEvents.findOne(eventID);
    Session.set('currentGroup',calendarEvent.group);
  }
});

Template.calendarEvent.helpers({
  title: function() {
    return Activities.findOne(this.activityID).title;
  },
  classes: function() {
    return "ui-state-default" + " " + this.workplace;
  }
});




var DropOpt = function () { 
  var newClass, currentClass; 

  var activate = function (event, ui) {
    var workPlaces = ['inClass','outClass','home'];
    var newWorkplace = _.intersection(workPlaces,ui.draggable[0].classList);
    if (newWorkplace.length == 1) {
      newClass = newWorkplace[0];
    };
  };

  var over = function (event, ui) {
    var eventID = $(event.target).data('eventid');
    var workPlaces = ['inClass','outClass','home'];
    var currentWorkplace = _.intersection(workPlaces,event.target.classList);
    if (currentWorkplace.length == 1) {
      currentClass = currentWorkplace[0];
    };
    if (newClass) {
      CalendarEvents.update(eventID,{$set: {workplace: newClass}});
    };
  };

  var out = function (event, ui) {
    var eventID = $(event.target).data('eventid');
    if (currentClass) {
      CalendarEvents.update(eventID,{$set: {workplace: currentClass}});
    };
  };

  var that = {                  
    accept : '#inClassSwatch, #outClassSwatch, #homeSwatch',
    tolerance : "touch",
    activate : activate,
    over : over,
    out  : out
  };

  return that;
};



