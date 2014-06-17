Meteor.publish('activities',function() {
    return Activities.find();
});
Meteor.publish('calendarEvents',function(currentUserID) {
  return CalendarEvents.find({$or: [ {group: {$in: [currentUserID]}},{invite: {$in: [currentUserID]}} ]});  
});
Meteor.publish('userList',function() {
  return Meteor.users.find({},{fields : {username : 1}});
});


