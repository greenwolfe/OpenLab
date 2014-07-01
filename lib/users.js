Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {
  // Store the original arguments
  var args = _.toArray(arguments).slice(1),
      options = args[0],
      origCallback = args[1];
  //callback occurs after user created
  var newCallback = function(error) {
    var userID = Meteor.userId();
    origCallback.call(this, error);
    Meteor.call('enrollStudent',userID, function(error, id) {
      if (error) {
        return alert(error.reason);
      };
    });
  };
  createUser(options,newCallback);
});
