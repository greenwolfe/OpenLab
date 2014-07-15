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
    var ActivityId;
    var models = Models.find().map( function(m) {return m.model});

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post an activity");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to post an activity.')
    
    if (!Activity.title || (Activity.title == defaultText) || (Activity.title == ''))
      throw new Meteor.Error(413, "Cannot post activity.  Missing title.");

    if (!Activity.model)
      throw new Meteor.Error(402, "Cannot post activity.  Missing model.");
   
    if (!_.in(Activity.model,models))
       throw new Meteor.Error(421, "Cannot post activity.  Improper model.")

    ActivityID = Activities.insert(Activity);

    return ActivityID; 
  }//,  

  /***** DELETE ACTIVITY ****/
  /*deleteActivity: function(NoteID) { 
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
  }, */

  /***** UPDATE ACTIVITY ****/
  /*updateActivity: function(NoteID,newText) { 
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
  } */
});  

if (Meteor.isServer) {
if (Activities.find().count() === 0) {
  Activities.insert({
    title : 'Acceleration Intro',
    model : Models.findOne({model:'CAPM'})._id
  });

  Activities.insert({
    title : 'Problem-solving with the Velocity Graph',
    model : Models.findOne({model:'CAPM'})._id
  }); 

  Activities.insert({
    title : 'Olympic Event - Designer Ramp',
    model : Models.findOne({model:'CAPM'})._id
  });

  Activities.insert({
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    model : Models.findOne({model:'CAPM'})._id
  });

  Activities.insert({
    title : 'Model Summary',
    model : Models.findOne({model:'CAPM'})._id
  });

  Activities.insert({
    title : 'Olympic Event - Hole in One',
    model : Models.findOne({model:'CAPM'})._id
  });

  Activities.insert({
    title : 'Broom Ball Review',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Force Diagrams for Stationary Objects',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Force Diagrams for Moving Objects',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Weight vs. Mass Lab',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Statics with Horizontal and Vertical Forces',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Statics with Forces at Angles',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Olympic Event - Stuffed Animals',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Dueling Forces',
    model : Models.findOne({model:'BFPM'})._id
  });

  Activities.insert({
    title : 'Model Summary',
    model : Models.findOne({model:'BFPM'})._id
  });
};
};
