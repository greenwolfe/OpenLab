Meteor.publish('activities',function() {
  return Activities.find();
});
Meteor.publish('sections',function() {
  return Sections.find();
});

Meteor.publish('calendarEvents',function(userArray) {
  //expecting userArray = [Meteor.userId(),'_ALL_']
  return CalendarEvents.find({$or: [ {group: {$in: userArray}},{invite: {$in: userArray}} ]});  //do I want just userArray to include _ALL_ here?
});
Meteor.publish('userList',function(currentUserID) {
  return Meteor.users.find({},{fields : {username : 1, roles: 1}});
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


