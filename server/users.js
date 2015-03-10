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


Meteor.methods({
/* Assign student role to user if is not already teacher */
/* called by wrapper to Accounts.createUser in /client/helpers */
/*  so all new users are assigned student role */
  enrollStudent: function(userID) {
    var currentUserId = Meteor.userId();
    if ( !(currentUserId && (userID == currentUserId)) ) {
      throw new Meteor.Error(401, "Cannot Enroll as Student");
    };
    if (!Roles.userIsInRole(userID,['teacher','student'])) {
      Roles.addUsersToRoles(userID,['student']);
    }; 
  },
/* Designate a student as the rabbit, whose account is used to */
/* determine expected progress.  Usually the teacher creates */
/* a dummy account (not a real student) and then keeps it updated */
/* to indicate expected progress.  There can only be one rabbit. */
  designateRabbit: function(studentID) {
    var cU = Meteor.user(); //current user
    var student = Meteor.users.findOne(studentID);
    var rabbits = Roles.getUsersInRole('rabbit').fetch();

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to designate a rabbit.");
    if (!Roles.userIsInRole(cU,'teacher')) 
      throw new Meteor.Error(442, "Only a teacher can designate a rabbit.");

    if (!student)
      throw new Meteor.Error(440, "Only a valid user can be designated as the rabbit.");
    if (!Roles.userIsInRole(student,'student')) 
      throw new Meteor.Error(442, "Only a student can be designated as rabbit.");

    if (rabbits && (rabbits.length > 0)) 
      throw new Meteor.Error(502, "There is already a designated rabbit. There can only be one." + rabbits[0].username);
    
    Roles.addUsersToRoles(studentID,['rabbit']);
  }
});






