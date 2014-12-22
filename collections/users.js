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

    /***** UPDATE FIRST AND LAST NAME ****/
  updateName: function(userID,firstName,lastName) { 
    var cU = Meteor.user(); //current user
    var user = Meteor.users.findOne(userID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to change your username");

    if (!user)
      throw new Meteor.Error(440, "Cannot change username.  Invalid user.");

    if (Roles.userIsInRole(cU,'teacher') || (userID  == cU._id)) {
      if (_.isString(firstName)) 
        Meteor.users.update({_id:userID}, { $set:{"profile.firstName":firstName}} );
      if (_.isString(lastName)) 
        Meteor.users.update({_id:userID}, { $set:{"profile.lastName":lastName}} );           
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
  },

  /***** CHANGE PASS ****/
  changePass: function(userID,newPassword) {
    var cU = Meteor.userId();
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(402, "Only a teacher can change another users password.");
    if (Meteor.isServer) {
      var student = Meteor.users.findOne(userID);
      Accounts.setPassword(userID,newPassword);
      student = Meteor.users.findOne(userID);
    }
  },


  /***** UPDATE RECENT GROUPIES ****/
  updateRecentGroupies: function(group) {
    group.forEach(function(userID) {
      var reducedGroup = _.without(group,userID);
      var cU = Meteor.users.findOne(userID);
      if (!cU) return;
      if (('profile' in cU) && ('recentGroupies' in cU.profile)) 
        reducedGroup = _.union(reducedGroup,cU.profile.recentGroupies);
      if (reducedGroup.length > 5)
        reducedGroup = reducedGroup.slice(0,5);
      Meteor.users.update(userID,{$set: {'profile.recentGroupies':reducedGroup}});   
    })
  },

  toggleGroupie: function(userID) {
    var cU = Meteor.user();
    if (!cU) 
      throw new Meteor.Error(402, "You must be logged in to change your recent groupies list.");
    var userToToggle = Meteor.users.findOne(userID);
    if (!userToToggle) 
      throw new Meteor.Error(403, "Cannot change groupies list. Invalid user.");
    if (('profile' in cU) && ('recentGroupies' in cU.profile)) {
      if (_.contains(cU.profile.recentGroupies,userID)) {
        Meteor.users.update(cU._id,{$pull: {'profile.recentGroupies':userID}})
      } else {
        Meteor.users.update(cU._id,{$addToSet: {'profile.recentGroupies':userID}});        
      };
    } else {
      Meteor.users.update(cU._id,{$set: {'profile.recentGroupies':[userID]}});
    };
  }

 });