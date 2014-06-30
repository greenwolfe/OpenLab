Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {

    // Store the original arguments
    var args = _.toArray(arguments).slice(1),
        options = args[0],
        origCallback = args[1];

    var newCallback = function(error) {
      var userID = Meteor.userId();
      console.log('in new callback');
      console.log('   userID ' + userID + ' enrolling student');
      Meteor.call('enrollStudent',userID, function(error, id) {
        if (error) {
          return alert(error.reason);
        };
      });
      console.log('    student enrolled');
      origCallback.call(this, error);
    };
    console.log('in createUser wrapper');
    createUser(options,newCallback);
    console.log('   user created');
});
