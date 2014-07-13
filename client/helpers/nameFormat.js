var nameFormat = function (userID,howlong) {
  var user = Meteor.users.findOne(userID);
  if (!user) return '';
  if (howlong == 'full') {
    return user.username;
  } else if (howlong == 'first') {
    return user.username;
  } else if (howlong == 'nick') {
    return user.username;
  }
};

UI.registerHelper('nameFormat', function(userID,howlong){
    return nameFormat(userID,howlong);
});
