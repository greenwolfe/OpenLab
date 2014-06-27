Meteor.publish('activities',function() {
    return Activities.find();
});
Meteor.publish('calendarEvents',function(currentUserID) {
  return CalendarEvents.find({$or: [ {group: {$in: [currentUserID,'_ALL_']}},{invite: {$in: [currentUserID]}} ]});  
});
Meteor.publish('userList',function() {
  return Meteor.users.find({},{fields : {username : 1}});
});
Meteor.publish('links',function(userArray) {
  return Links.find( {group: {$in: userArray} });
});
Meteor.publish('notes',function(userArray) {
  return Notes.find( {group: {$in: userArray} });
});
Meteor.publish('todos',function(userArray) {
  return Todos.find( {group: {$in: userArray} });
});
//may want to publish all and move the selectors to the subscriptions, so that the teacher can see everyone's collection items


