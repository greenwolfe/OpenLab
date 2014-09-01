LevelsOfMastery = new Meteor.Collection('levelsofmastery');

/*
     var LoM = {
      teacherID : Meteor.userId(),
      studentID : studentID,
      activityID : this._id,
      standardID : standardID,
      level : level,
      submitted : new Date().getTime(),
      comment : comment,
      visible: true
    };   
*/
  
  Meteor.methods({

  /***** POST LoM ****/
  postLoM: function(LoM,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var activity, standard, LoMId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a level of mastery");

    if (!LoM.teacherID || (cU._id != LoM.teacherID) || !Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(402, "Only a teacher can post a level of mastery.");

    if (!LoM.hasOwnProperty('studentID') || !Meteor.users.findOne(LoM.studentID))
      throw new Meteor.Error(402, "Cannot post level of mastery.  Invalid student ID.");

    if (!LoM.hasOwnProperty('activityID') || !Activities.findOne(LoM.activityID))
      throw new Meteor.Error(406, "Cannot post level of mastery.  Invalid activity ID.");
    activity = Activities.findOne(LoM.activityID);

    if (!LoM.hasOwnProperty('standardID') || !Standards.findOne(LoM.standardID))
      throw new Meteor.Error(406, "Cannot post level of mastery.  Invalid standard ID.");
    standard = Standards.findOne(LoM.standardID);

    if (!activity.hasOwnProperty('standardIDs') || !_.contains(activity.standardIDs,LoM.standardID))
      throw new Meteor.Error(466, "Cannot post level of mastery.  Indicated standard not assigned to indicated activity.");

    if (!LoM.hasOwnProperty('level') || !_.contains(standard.scale,LoM.level))
      throw new Meteor.Error(467, "Cannot post level of mastery.  Level must be one of " + standard.scale.join(", ") + ".");

    if (!LoM.submitted)// || !moment(LoM.submitted,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot post level of mastery.  Invalid date");

    if (!LoM.comment || (LoM.comment == defaultText))
      LoM.comment = '';

    if (!LoM.hasOwnProperty('visible'))
      LoM.visible = true;

    LoMId = LevelsOfMastery.insert(LoM);

    return LoMId;
  }

});


