Meteor.methods({

  /***** UPDATE USERNAME ****/
  updateUsername: function(userID,userName) { 
    var cU = Meteor.user(); //current user
    var user = Meteor.users.findOne(userID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to change your username");

    if (!user)
    	throw new Meteor.Error(440, "Cannot change username.  Invalid user.");

    if (userID != cU._id)
    	throw new Meteor.Error(441,"You cannot change someone else's user name.");

    if ((userName != cU.username) && (userName != '')) {
    	Meteor.users.update({_id:userID}, { $set:{username:userName}} );
    }
  }
 });