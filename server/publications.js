Meteor.publish('activities',function(showHidden) {
  if (showHidden) {
    return Activities.find();
  } else {
    return Activities.find({visible:true});
  }
});
Meteor.publish('sections',function() {
  return Sections.find();
});
Meteor.publish('models',function(showHidden) {
  if (showHidden) {
    return Models.find();
  } else {
    return Models.find({visible:true});
  }
});

Meteor.publish('calendarEvents',function(userArray) {
  //expecting userArray = [Meteor.userId(),Meteor.userId.profile.sectionID'_ALL_']
  return CalendarEvents.find({$or: [ {group: {$in: userArray}},{invite: {$in: userArray}} ]});  //do I want just userArray to include _ALL_ here?
});
Meteor.publish('completedActivities',function(userID) {
  var cU = Meteor.users.findOne(userID);
  if (cU && cU.hasOwnProperty('completedActivities'))
    return Meteor.users.find(userID,{fields: {completedActivities: 1}});
  return this.ready();
});
Meteor.publish('userList',function() {
  if (this.userId) {
    return Meteor.users.find({},{fields : {username : 1, roles: 1, profile: 1}});
  } else {
    this.ready(); //returns blank collection
  };
});
Meteor.publish('links',function(userArray) {
  return Links.find( {group: {$in: userArray} });
});
Meteor.publish('notes',function(userArray) {
  return Notes.find( {group: {$in: userArray} });
});
Meteor.publish('notesByAuthor',function(author) {
  if ( this.userId && Roles.userIsInRole(this.userId,'teacher') ) {
    return Notes.find( {author: author} );
  } else {
    this.ready();
  };
});
Meteor.publish('todos',function(userArray) {
  return Todos.find( {group: {$in: userArray} });
});

Meteor.publish('standards',function(showHidden) {
  if (showHidden) {
    return Standards.find();
  } else {
    return Standards.find({visible:true});
  }
});


