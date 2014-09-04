Notes = new Meteor.Collection('notes');

/*
     if ((text == $('#newNote').data('defaultText') || (text == ''))) return;
    text += _(text).endsWith('<br>') ? '':'<br>';
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text,
      visible: true
    };   
*/

Meteor.methods({

  /***** POST NOTE ****/
  postNote: function(Note,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var NoteId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a note");

    if (!Note.author || (cU._id != Note.author))
      throw new Meteor.Error(402, "Only the currently logged in user can post a note.");

    if (!Note.text || (Note.text == defaultText) || (Note.text == ''))
      throw new Meteor.Error(413, "Cannot post note.  Missing text.");
    Note.text += _(Note.text).endsWith('<br>') ? '':'<br>';

    if (!Note.hasOwnProperty('visible'))
      Note.visible = true;

    if (!Note.hasOwnProperty('group') || !_.isArray(Note.group))
      throw new Meteor.Error(402, "Cannot post note.  Improper group.");

    Note.group.forEach(function(ID) {
      if (!Meteor.users.findOne(ID) && !Sections.findOne(ID) && !(ID == '_ALL_'))
        throw new Meteor.Error(404, "Cannot post note.  Group members must be valid users.");
    });

    if (!Note.hasOwnProperty('activityID') || !Activities.findOne(Note.activityID))
      throw new Meteor.Error(406, "Cannot post note.  Invalid activity ID.");

    if (!Note.hasOwnProperty('submitted'))// || !moment(Note.submitted,'ddd[,] MMM D YYYY',true).isValid())
      Note.submitted = new Date().getTime();

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

  /***** DELETE NOTE ****/
  deleteNote: function(NoteID) { 
    var cU = Meteor.user(); //currentUser
    var Note = Notes.findOne(NoteID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a note.");

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

  /***** UPDATE NOTE ****/
  updateNote: function(NoteID,newText,otherFields) { 
    var cU = Meteor.user(); //currentUser
    var Note = Notes.findOne(NoteID);
    var now, editDeadline;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a note.");

    if (!Note)
      throw new Meteor.Error(412, "Cannot update note.  Invalid ID.");

    if (!Note.hasOwnProperty('group') || !_.isArray(Note.group))
      throw new Meteor.Error(402, "Cannot update note.  Improper group.");

    //need code to handle _ALL_ or blocks
    Note.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot update note.  Group members must be valid users.");
    });

    if (newText == '') newText = Note.text;
    newText += _(newText).endsWith('<br>') ? '':'<br>';

    if (Roles.userIsInRole(cU,'teacher')) {
     Notes.update(NoteID,{$set: {text: newText}});
     if (!!otherFields && otherFields.hasOwnProperty('visible') && (otherFields.visible != Note.visible))
      Notes.update(NoteID,{$set: {visible: otherFields.visible}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Note.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot update note unless you are part of the group.')
      if (Note.submitted) {
        now = moment();
        editDeadline = moment(Note.submitted).add('minutes',30);  
        if (now.isAfter(editDeadline))
          throw new Meteor.Error(411, "You may only update a note if you do so within 30 minutes of posting it.");     
      } else {
        throw new Meteor.Error(411, "Cannot update note.  Invalid date");
      };
      Notes.update(NoteID,{$set: {text: newText}});
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to update a note.')
    };

    return NoteID;
  } 
});
