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

    if (!LoM.hasOwnProperty('submitted'))// || !moment(LoM.submitted,'ddd[,] MMM D YYYY',true).isValid())
      LoM.submitted = new Date().getTime();

    if (!LoM.comment || (LoM.comment == defaultText))
      LoM.comment = '';

    if (!LoM.hasOwnProperty('visible'))
      LoM.visible = true;

    LoMId = LevelsOfMastery.insert(LoM);

    return LoMId;
  },

  /**** DELETE LoM *****/
  deleteLoM: function(LoMId) {
    var cU = Meteor.user(); //currentUser
    var LoM = LevelsOfMastery.findOne(LoMId);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a level of mastery");
 
    if (!LoM)
      throw new Meteor.Error(412, "Cannnot delete level of mastery.  Invalid ID.");

    if (!LoM.teacherID || (cU._id != LoM.teacherID) || !Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(402, "Only a teacher can delete a level of mastery, and it must be one you posted in the first place.");

    if (LoM.hasOwnProperty('visible') && LoM.visible)
      throw new Meteor.Error(468, "To delete a level of mastery, first hide it and then you will be able to delete it.");

    LevelsOfMastery.remove(LoMId);

    return LoMId;    
  },

  /**** UPDATE LoM *****/
  updateLoM: function(nLoM,updateTime) {
    var cU = Meteor.user(); //currentUser
    var LoM = LevelsOfMastery.findOne(nLoM._id);
    var uT = false; //updateTime

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a level of mastery");

    if (!LoM)
      throw new Meteor.Error(412, "Cannnot update level of mastery.  Invalid ID.");

    if (!LoM.teacherID || (cU._id != LoM.teacherID) || !Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(402, "Only a teacher can update a level of mastery, and it must be one you posted in the first place.");

    if (!LoM.hasOwnProperty('activityID') || !Activities.findOne(LoM.activityID))
      throw new Meteor.Error(406, "Cannot update level of mastery.  Invalid activity ID.");
    activity = Activities.findOne(LoM.activityID);

    if (!LoM.hasOwnProperty('standardID') || !Standards.findOne(LoM.standardID))
      throw new Meteor.Error(406, "Cannot update level of mastery.  Invalid standard ID.");
    standard = Standards.findOne(LoM.standardID);

    if (nLoM.hasOwnProperty('level') && !_.contains(standard.scale,nLoM.level))
      throw new Meteor.Error(467, "Cannot post level of mastery.  Level must be one of " + standard.scale.join(", ") + ".");
    if (nLoM.hasOwnProperty('level') && (nLoM.level != LoM.level)) {
      LevelsOfMastery.update(nLoM._id,{$set: {level: nLoM.level}});
      uT = updateTime;
    }

    if (nLoM.hasOwnProperty('comment') && (nLoM.comment != LoM.comment)) {
      LevelsOfMastery.update(nLoM._id,{$set: {comment: nLoM.comment}});
      uT = updateTime;
    }

    if (nLoM.hasOwnProperty('visible') && (nLoM.visible != LoM.visible)) {
      LevelsOfMastery.update(nLoM._id,{$set: {visible: nLoM.visible}});
      uT = updateTime;
    }

    if (uT)
      LevelsOfMastery.update(nLoM._id,{$set: {submitted: new Date().getTime()}});

    return LoM._id;    
  }

});



