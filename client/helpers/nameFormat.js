var nameFormat = function (userID,howlong) {
  if (howlong == 'full') {
    return Meteor.users.findOne(userID).username;
  } else if (howlong == 'first') {
    return Meteor.users.findOne(userID).username;
  } else if (howlong == 'nick') {
    return Meteor.users.findOne(userID).username;
  }
};

UI.registerHelper('nameFormat', function(userID,howlong){
    return nameFormat(userID,howlong);
});
