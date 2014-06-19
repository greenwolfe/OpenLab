Meteor.publish('activities',function() {
    return Activities.find();
});
Meteor.publish('calendarEvents',function(currentUserID) {
  return CalendarEvents.find({$or: [ {group: {$in: [currentUserID,'_ALL_']}},{invite: {$in: [currentUserID,'_ALL_']}} ]});  
});
Meteor.publish('userList',function() {
  return Meteor.users.find({},{fields : {username : 1}});
});
Meteor.publish('links',function(currentUserID) {
  return Links.find( {group: {$in: [currentUserID,'_ALL_']} });
});
Meteor.publish('notes',function(currentUserID) {
  return Notes.find( {group: {$in: [currentUserID,'_ALL_']} });
});
//may want to publish all and move the selectors to the subscriptions, so that the teacher can see everyone's collection items


