Notes = new Meteor.Collection('notes');

/*
     if ((text == $('#newNote').data('defaultText') || (text == ''))) return;
    text += _(text).endsWith('<br>') ? '':'<br>';
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text
    };   
*/

Meteor.methods({

  /***** POST TODO ****/
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

  /***** DELETE NOTE ****/
  deleteNote: function(NoteID) { 
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
  }//, 

  /***** TOGGLE TODO CHECKED ****/
/*  toggleTodo: function(TodoID) { 
    var cU = Meteor.user(); //currentUser
    var Todo = Todos.findOne(TodoID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to check or uncheck a todo item");

    if (!Todo)
      throw new Meteor.Error(412, "Cannot check or uncheck todo item.  Invalid ID.");

    if (!Todo.hasOwnProperty('group') || !_.isArray(Todo.group))
      throw new Meteor.Error(402, "Cannot check or uncheck todo item.  Improper group.");

    //need code to handle _ALL_ or blocks
    Todo.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot check or uncheck todo item.  Group members must be valid users.");
    });

    if (Roles.userIsInRole(cU,'teacher')) {
     Todos.update(TodoID,{$set: {checked: !Todo.checked}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Todo.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot check or uncheck todo item unless you are part of the group.')
      Todos.update(TodoID,{$set: {checked: !Todo.checked}});
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to check or uncheck a todo item.')
    };

    return TodoID;
  } */
});
