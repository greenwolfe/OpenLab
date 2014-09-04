PostGameAnalyses = new Meteor.Collection('postgameanalyses');

/*
    var PGA = {
      authorID : Meteor.userId(),
      studentID: Meteor.userId(), //student = author unless author is a teacher
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text,
      visible: true
    };   
*/

Meteor.methods({

  /***** POST PGA ****/
  postPGA: function(PGA,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var PgaID;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a Post Game Analysis");

    if (!PGA.authorID || (cU._id != PGA.authorID))
      throw new Meteor.Error(402, "Only the currently logged in user can post a Post Game Analysis.");

    if (!PGA.studentID || !Meteor.users.findOne(PGA.studentID))
      throw new Meteor.Error(403, "Cannot post Post Game Analysis.  Invalid student ID.")

    if (!PGA.text || (PGA.text == defaultText) || (PGA.text == ''))
      throw new Meteor.Error(413, "Cannot post Post Game Analysis.  Missing text.");
    PGA.text += _(PGA.text).endsWith('<br>') ? '':'<br>';

    if (!PGA.hasOwnProperty('visible'))
      PGA.visible = true;

    if (!PGA.hasOwnProperty('activityID') || !Activities.findOne(PGA.activityID))
      throw new Meteor.Error(406, "Cannot post Post Game Analysis.  Invalid activity ID.");

    if (!PGA.hasOwnProperty('submitted'))// || !moment(PGA.submitted,'ddd[,] MMM D YYYY',true).isValid())
      PGA.submitted = new Date().getTime();

    if (Roles.userIsInRole(cU,'teacher')) {
     PgaID = PostGameAnalyses.insert(PGA);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!(PGA.authorID == PGA.studentID))
        throw new Meteor.Error(408, 'You can only post Post Game Analysis unless for yourslef.')
      PgaID = PostGameAnalyses.insert(PGA);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to post a Post Game Analysis.')
    };

    return PgaID;
  },

  /***** DELETE PGA ****/
  deletePGA: function(PgaID) { 
    var cU = Meteor.user(); //currentUser
    var PGA = PostGameAnalyses.findOne(PgaID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a Post Game Analysis.");

    if (!PGA)
      throw new Meteor.Error(412, "Cannot delete Post Game Analysis.  Invalid ID.");

    if (Roles.userIsInRole(cU,'teacher')) {
     PostGameAnalyses.remove(PgaID);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!(cU._id == PGA.studentID) || !(PGA.studentID == PGA.authorID)) 
        throw new Meteor.Error(408, 'You can only delete your own Post Game Analyses.');
      if (PGA.submitted) {
        now = moment();
        editDeadline = moment(PGA.submitted).add('minutes',30);  
        if (now.isAfter(editDeadline))
          throw new Meteor.Error(411, "You may only delete a Post Game Analysis if you do so within 30 minutes of posting it.");     
      } else {
        throw new Meteor.Error(411, "Cannot delete Post Game Analysis.  Invalid date");
      };
      PostGameAnalyses.remove(PgaID);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to delete a Post Game Analysis.')
    };

    return PgaID;
  },

  /***** UPDATE PGA ****/
  updatePGA: function(PgaID,newText,otherFields) { 
    var cU = Meteor.user(); //currentUser
    var PGA = PostGameAnalyses.findOne(PgaID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a Post Game Analysis.");

    if (!PGA)
      throw new Meteor.Error(412, "Cannot update Post Game Analysis.  Invalid ID.");

    if (newText == PGA.text) return PgaID;
    newText += _(newText).endsWith('<br>') ? '':'<br>';

    if (Roles.userIsInRole(cU,'teacher')) {
     PostGameAnalyses.update(PgaID,{$set: {text: newText}});
     if (!!otherFields && otherFields.hasOwnProperty('visible') && (otherFields.visible != PGA.visible))
      PostGameAnalyses.update(PgaID,{$set: {visible: otherFields.visible}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!(cU._id == PGA.studentID) || !(PGA.studentID == PGA.authorID)) 
        throw new Meteor.Error(408, 'You can only delete your own Post Game Analyses.')
      if (PGA.submitted) {
        now = moment();
        editDeadline = moment(PGA.submitted).add('minutes',30);  
        if (now.isAfter(editDeadline))
          throw new Meteor.Error(411, "You may only update a Post Game Analysis if you do so within 30 minutes of posting it.");     
      } else {
        throw new Meteor.Error(411, "Cannot update Post Game Analysis.  Invalid date");
      };
      PostGameAnalyses.update(PgaID,{$set: {text: newText}});
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to update a Post Game Analysis.')
    };

    return PgaID;
  } 
});