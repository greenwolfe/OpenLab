Notes = new Meteor.Collection('notes');

Notes.allow({
  insert: function(userId, doc) {
    // only allow adding a note to an activity if you are logged in and are in the group list of the note
    return (!! userId && (doc.group.indexOf(userId) + 1));
  }
});
