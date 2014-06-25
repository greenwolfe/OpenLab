Todos = new Meteor.Collection('todos');

Todos.allow({
  insert: function(userId, doc) {
    // only allow adding a link to an activity if you are logged in and are in the group list of the todo item
    return (!! userId && (doc.group.indexOf(userId) + 1));
  },
  remove: function(userId,doc) {
    return (!! userId && (doc.group.indexOf(userId) + 1));
  },
  update: function(userId,doc) {
    return (!! userId && (doc.group.indexOf(userId) + 1));
  }
});
