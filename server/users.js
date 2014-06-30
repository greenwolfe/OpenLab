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
    console.log('on server in enrollStudent');
    Roles.addUsersToRoles(userID,['student']);
/*    var currentUserId = Meteor.userId();
    if ( !(currentUserId && (userID == currentUserId)) ) {
      console.log('    throwing error');
      throw new Meteor.Error(401, "Cannot Enroll as Student");
    };
    console.log('   past error');
    if (!Roles.userIsInRole(userID,['teacher','student'])) {
      console.log('    adding student role');
      Roles.addUsersToRoles(userID,['student']);
    }; */
  }
});



