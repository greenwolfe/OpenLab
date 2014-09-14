Meteor.methods({

  /***** UPDATE USERNAME ****/
  updateUsername: function(userID,userName) { 
    var cU = Meteor.user(); //current user
    var user = Meteor.users.findOne(userID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to change your username");

    if (!user)
    	throw new Meteor.Error(440, "Cannot change username.  Invalid user.");

    if (!userName || userName.length < 3)
      throw new Meteor.Error(441, "Usernames must be at least 3 characters long.");

    if (Roles.userIsInRole(cU,'teacher')) {
      if (userName != user.username) {
        Meteor.users.update({_id:userID}, { $set:{username:userName}} );
      }      
    } else if (userID  == cU._id) {
      if (userName != cU.username) {
        Meteor.users.update({_id:userID}, { $set:{username:userName}} );
      }
    } else {
    	throw new Meteor.Error(441,"You cannot change someone else's user name.");
    }
  },

  /***** REMOVE USER ****/
  removeUser: function(userID) { 
    var cU = Meteor.user(); //current user
    var user = Meteor.users.findOne(userID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to change your username");

    if (!user)
      throw new Meteor.Error(440, "Cannot delete user.  Invalid ID.");

    if (!Roles.userIsInRole(cU,'teacher')) 
      throw new Meteor.Error(442, "You must be a teacher to delete a user.")
    
    console.log('removing ' + user.username);
    Meteor.users.remove(userID);
  }

 });