/* wraps Accounts.createUser with a routine that first calls the original */ 
/* createUser with the options passed in, then gives student role to new user */
/* Must run on client, as creatUser crashes the app if you try to pass it a callback on the server */
/* Calls server method enrollStudent that gives new user the student role */

Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {
  // Store the original arguments
  var args = _.toArray(arguments).slice(1),
      options = args[0],
      origCallback = args[1];
  //callback occurs after user created and automatically logged in
  var newCallback = function(error) {
    var userID = Meteor.userId();
    origCallback.call(this, error);
    Meteor.call('enrollStudent',userID, function(error, id) {
      if (error) {
        return alert(error.reason);
      };
    });
    console.log('resetting TeacherViewAs');
  };
  createUser(options,newCallback);
});

Deps.autorun(function() {
  var userID = Meteor.userId();
  if (userID && Roles.userIsInRole(userID,'teacher')) {
    Session.set('TeacherViewAs',userID);
  };
});
