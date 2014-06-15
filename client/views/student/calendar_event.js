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




var DropOpt = function () { //default dropable options
  var drop = function (event, ui) {  
    var eventID = $(event.target).data('eventid');
    var workPlaces = ['inClass','outClass','home'];
    var newWorkplace = _.intersection(workPlaces,ui.draggable[0].classList);
    if (newWorkplace.length == 1) {
      CalendarEvents.update(eventID,{$set: {workplace: newWorkplace}});
    };
  }; 

  var that = {                  
    accept : '#inClassSwatch, #outClassSwatch, #homeSwatch',
    tolerance : "touch",
    drop : drop
 //on hover, change color only ... how to do this?  tried hoverClass, but it won't override the existing classes
  };

  return that;
};



