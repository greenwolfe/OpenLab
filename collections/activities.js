Activities = new Meteor.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
  // only allow adding activities if you are logged in
  // must alter this to only allow teacher to add activities
  return !! userId;
  }
}); 

  /* Activities.insert({
    title : 'Acceleration Intro',
    model : 'CAPM',
    description : ''
  }); */

Meteor.methods({

  /***** POST ACTIVITY ****/
  postActivity: function(Activity,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var NoteId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post an activity");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to post an activity.')
    
    if (!Note.text || (Note.text == defaultText) || (Note.text == ''))
      throw new Meteor.Error(413, "Cannot post note.  Missing text.");
    Note.text += _(Note.text).endsWith('<br>') ? '':'<br>';

    if (!Note.hasOwnProperty('group') || !_.isArray(Note.group))
      throw new Meteor.Error(402, "Cannot post note.  Improper group.");

    //need code to handle _ALL_ or blocks
    Note.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot post note.  Group members must be valid users.");
    });

    if (!Note.hasOwnProperty('activityID') || !Activities.findOne(Note.activityID))
      throw new Meteor.Error(406, "Cannot post note.  Invalid activity ID.");

    if (!Note.submitted)// || !moment(Note.submitted,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot post note.  Invalid date");

    if (Roles.userIsInRole(cU,'teacher')) {
     NoteID = Notes.insert(Note);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Note.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot post note unless you are part of the group.')
      NoteID = Notes.insert(Note);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to post a note.')
    };

    return NoteID;
  },

  /***** DELETE ACTIVITY ****/
  deleteActivity: function(NoteID) { 
    var cU = Meteor.user(); //currentUser
    var Note = Notes.findOne(NoteID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a note");

    if (!Note)
      throw new Meteor.Error(412, "Cannot delete note.  Invalid ID.");

    if (!Note.hasOwnProperty('group') || !_.isArray(Note.group))
      throw new Meteor.Error(402, "Cannot delete note.  Improper group.");

    //need code to handle _ALL_ or blocks
    Note.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot delete note.  Group members must be valid users.");
    });

    if (Roles.userIsInRole(cU,'teacher')) {
     Notes.remove(NoteID);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Note.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot delete note unless you are part of the group.')
      if (Note.submitted) {
        now = moment();
        editDeadline = moment(Note.submitted).add('minutes',30);  
        if (now.isAfter(editDeadline))
          throw new Meteor.Error(411, "You may only delete a note if you do so within 30 minutes of posting it.");     
      } else {
        throw new Meteor.Error(411, "Cannot delete note.  Invalid date");
      };
      Notes.remove(NoteID);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to delete a note.')
    };

    return NoteID;
  }, 

  /***** UPDATE ACTIVITY ****/
  updateActivity: function(NoteID,newText) { 
    var cU = Meteor.user(); //currentUser
    var Note = Notes.findOne(NoteID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a note");

    if (!Note)
      throw new Meteor.Error(412, "Cannot delete note.  Invalid ID.");

    if (!Note.hasOwnProperty('group') || !_.isArray(Note.group))
      throw new Meteor.Error(402, "Cannot delete note.  Improper group.");

    //need code to handle _ALL_ or blocks
    Note.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot delete note.  Group members must be valid users.");
    });

    if (newText == Note.text) return NoteID;
    newText += _(newText).endsWith('<br>') ? '':'<br>';

    if (Roles.userIsInRole(cU,'teacher')) {
     Notes.update(NoteID,{$set: {text: newText}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Note.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot delete note unless you are part of the group.')
      if (Note.submitted) {
        now = moment();
        editDeadline = moment(Note.submitted).add('minutes',30);  
        if (now.isAfter(editDeadline))
          throw new Meteor.Error(411, "You may only delete a note if you do so within 30 minutes of posting it.");     
      } else {
        throw new Meteor.Error(411, "Cannot delete note.  Invalid date");
      };
      Notes.update(NoteID,{$set: {text: newText}});
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to delete a note.')
    };

    return NoteID;
  } 
});

if (Meteor.isServer) {
if (Activities.find().count() === 0) {
  Activities.insert({
    title : 'Acceleration Intro',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Problem-solving with the Velocity Graph',
    model : 'CAPM'
  }); 

  Activities.insert({
    title : 'Olympic Event - Designer Ramp',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Model Summary',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Olympic Event - Hole in One',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Broom Ball Review',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Force Diagrams for Stationary Objects',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Force Diagrams for Moving Objects',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Weight vs. Mass Lab',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Statics with Horizontal and Vertical Forces',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Statics with Forces at Angles',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Olympic Event - Stuffed Animals',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Dueling Forces',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Model Summary',
    model : 'BFPM'
  });
};
};
