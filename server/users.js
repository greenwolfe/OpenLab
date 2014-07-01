Accounts.config({
  loginExpirationInDays: null
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
      var id = Accounts.createUser({
        password: "password",
        username: 'Gwolfe'
      });
      Roles.addUsersToRoles(id, ['teacher']);
    };
  });
};

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



