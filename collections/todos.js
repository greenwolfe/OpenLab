Todos = new Meteor.Collection('todos');

/*
     var todo = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text,
      checked: false,
      visbile: true
     }
*/
Meteor.methods({

  /***** POST TODO ****/
  postTodo: function(Todo) { 
    var cU = Meteor.user(); //currentUser
    var TodoId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a todo item");

    if (!Todo.author || (cU._id != Todo.author))
      throw new Meteor.Error(402, "Only the currently logged in user can post a todo item.");

    if (!Todo.text || (Todo.text == 'New Todo Item') || (Todo.text == ''))
      throw new Meteor.Error(413, "Cannot post todo item.  Missing text.");

    if (!Todo.hasOwnProperty('checked') || !_.isBoolean(Todo.checked))
      throw new Meteor.Error(413, "Cannot post todo item.  Checked status not provided.");

    if (!Todo.hasOwnProperty('visible'))
      Todo.visible = true;

    if (!Todo.hasOwnProperty('group') || !_.isArray(Todo.group))
      throw new Meteor.Error(402, "Cannot post todo item.  Improper group.");

    //need code to handle _ALL_ or blocks
    Todo.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot post todo item.  Group members must be valid users.");
    });

    if (!Todo.hasOwnProperty('activityID') || !Activities.findOne(Todo.activityID))
      throw new Meteor.Error(406, "Cannot post todo item.  Invalid activity ID.");

    if (!Todo.submitted)// || !moment(Todo.submitted,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot post todo item.  Invalid date");

    if (Roles.userIsInRole(cU,'teacher')) {
     TodoID = Todos.insert(Todo);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Todo.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot post todo item unless you are part of the group.')
      TodoID = Todos.insert(Todo);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to post a todo item.')
    };

    return TodoID;
  },

  /***** DELETE TODO ****/
  deleteTodo: function(TodoID) { 
    var cU = Meteor.user(); //currentUser
    var Todo = Todos.findOne(TodoID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a todo item");

    if (!Todo)
      throw new Meteor.Error(412, "Cannot delete todo item.  Invalid ID.");

    if (!Todo.hasOwnProperty('group') || !_.isArray(Todo.group))
      throw new Meteor.Error(402, "Cannot delete todo item.  Improper group.");

    //need code to handle _ALL_ or blocks
    Todo.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot delete todo item.  Group members must be valid users.");
    });

    if (Roles.userIsInRole(cU,'teacher')) {
     Todos.remove(TodoID);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Todo.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot delete todo item unless you are part of the group.')
      Todos.remove(TodoID);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to delete a todo item.')
    };

    return TodoID;
  },

  /***** TOGGLE TODO CHECKED ****/
  toggleTodo: function(TodoID,otherFields) { 
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
     //must be a better place to put this in a full update function
     if (!!otherFields && otherFields.hasOwnProperty('visible') && (otherFields.visible != Todo.visible))
      Todos.update(TodoID,{$set: {visible: otherFields.visible}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Todo.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot check or uncheck todo item unless you are part of the group.')
      Todos.update(TodoID,{$set: {checked: !Todo.checked}});
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to check or uncheck a todo item.')
    };

    return TodoID;
  }
});
