Accounts.config({
  loginExpirationInDays: null
});

/*  define the teacher account and assign role*/
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
      var id = Accounts.createUser({
        password: "password",
        email: "matt_greenwolfe@caryacademy.org",
        username: 'Gwolfe'
      });
      Roles.addUsersToRoles(id, ['teacher']);
    };
  });
}; 

if (Meteor.isServer) {
  Meteor.users.find().forEach(function(u) {
    if (u.hasOwnProperty('emails')) {
      var email = u.emails[0].address;
      var name = email.match(/([^_]+)_([^@]+)@*/);
      var firstName,lastName;
      if (name && name.length == 3) {
        firstName = name[1].charAt(0).toUpperCase() + name[1].substring(1);
        lastName = name[2].charAt(0).toUpperCase() + name[2].substring(1);
        if (u.hasOwnProperty('profile')) {
          if (!u.profile.hasOwnProperty('firstName') && !u.hasOwnProperty('lastName')) {
            Meteor.users.update({_id:u._id}, { $set:{"profile.lastName":lastName} });
            Meteor.users.update({_id:u._id}, { $set:{"profile.firstName":firstName} });            
          };
        };     
      } else {
        name = email.match(/([^@]+)@*/);
        name = (!!name && name.length == 2) ? name[1] : email;
        lastName = name.charAt(0).toUpperCase() + name.substring(1);
        Meteor.users.update({_id:u._id}, { $set:{"profile.lastName":lastName} });
        Meteor.users.update({_id:u._id}, { $set:{"profile.firstName":''} });
      };
    };
  });
};

/* assign student role to user if is not already teacher */
/* called by wrapper to Accounts.createUser in /client/helpers */
/*  so all new users are assigned student role */
Meteor.methods({
  enrollStudent: function(userID) {
    var currentUserId = Meteor.userId();
    if ( !(currentUserId && (userID == currentUserId)) ) {
      throw new Meteor.Error(401, "Cannot Enroll as Student");
    };
    if (!Roles.userIsInRole(userID,['teacher','student'])) {
      Roles.addUsersToRoles(userID,['student']);
    }; 
  }
});






