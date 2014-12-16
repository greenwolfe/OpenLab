Meteor.publish('activities',function(userID) {  //change to user or section ID in order to generate summary page for whole activity and section ... later!
  var userToShow = Meteor.users.findOne(userID);
  var Acts = Activities.find({visible:true});
  if (!userToShow) return Acts;
  if (Roles.userIsInRole(userToShow,'teacher')) 
    return Activities.find();  

  return Acts;
  //removed because caused problems with subscription not updating
  //when reassessment added.
  //I think it was only being used in the assessment block of
  //studentView, which has been elminated in any case
  
  /*Acts.forEach(function(Act) {
    if (Act.standardIDs && Act.standardIDs.length) {
      Act.LoMs = mostRecentLoMs(Act,userID);
    }
    this.added('activities',Act._id,Act);
  }, this);

  this.ready();*/
});
Meteor.publish('site',function() {
  return Site.find();
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

Meteor.publish('attendance',function(date) {
  return Attendance.find({date:date});
});

Meteor.publish('completedActivities',function(userID) {
  var cU = Meteor.users.findOne(userID);
  if (cU && cU.hasOwnProperty('completedActivities'))
    return Meteor.users.find(userID,{fields: {completedActivities: 1}});
  return this.ready();
});
Meteor.publish('gradesAndStatus',function(userID){
  var cU = Meteor.users.findOne(userID);
  var fields = {};
  if (!cU) return this.ready();
  if (cU.hasOwnProperty('activityStatus')) fields.activityStatus = 1;
  if (cU.hasOwnProperty('LoMs')) fields.LoMs = 1;
  if (cU.hasOwnProperty('frozen')) fields.frozen = 1;
  if (_.isEmpty(fields)) return this.ready();
  return Meteor.users.find(userID,{fields: fields});
});
Meteor.publish('userList',function() {
  if (this.userId) {
    return Meteor.users.find({},{fields : {username : 1, roles: 1, profile: 1, emails: 1}});
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

Meteor.publish('standards',function(userID) {  //change to user or section ID and pass array or IDs to grade calculator to get an object back {userID:LOM,userID,LOM, ...}
  var userToShow = Meteor.users.findOne(userID);
  var Sts =  Standards.find({visible:true});
  if (!userToShow) return Sts;
  if (Roles.userIsInRole(userToShow,'teacher')) 
    return Standards.find();

  return Sts;
//replaced with system that stores and updates a users
//current LoM in the user object
/*  Sts.forEach(function(St) {
    St.LoM = mostRecent(St._id,userID,null); 
    this.added('standards',St._id,St);
  }, this); 

  this.ready(); */
});

Meteor.publish('levelsOfMastery',function(studentID) {
  if ( this.userId && Roles.userIsInRole(this.userId,'teacher') ) {
    return LevelsOfMastery.find( {studentID: studentID} );
  } else if (this.userId && (studentID == this.userId)) {
    return LevelsOfMastery.find( {studentID: studentID, visible:true} );
  } else {
    this.ready();
  };
});

Meteor.publish('postGameAnalyses',function(studentID) {
  if ( this.userId && Roles.userIsInRole(this.userId,'teacher') ) {
    return PostGameAnalyses.find( {studentID: studentID} );
  } else if (this.userId && (studentID == this.userId)) {
    return PostGameAnalyses.find( {studentID: studentID, visible:true} );
  } else {
    this.ready();
  };
});

mostRecent = function(standardID,studentID,activityID) { //expand to activtyID as well
  var selector = {
    standardID: standardID,
    studentID: studentID,
    visible: true
  };
  if (activityID)
    selector.activityID = activityID;
  LoM = LevelsOfMastery.find(selector,
                             {sort:[["submitted","desc"]]},
                             {limit:1}).fetch();
  return (LoM.length) ? LoM[0].level : null;
};

mostRecentLoMs = function(Activity,studentID) {
  var LoMs = {};
  Activity.standardIDs.forEach(function(standardID) {
    LoMs[standardID] = mostRecent(standardID,studentID,Activity._id);
  });
  return LoMs;
}
