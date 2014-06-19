var nameFormat = function (userID,howlong) {
  if (howlong == 'full') {
    return Meteor.user(userID).username;
  } else if (howlong == 'first') {
    return Meteor.user(userID).username;
  } else if (howlong == 'nick') {
    return Meteor.user(userID).username;
  }
};

UI.registerHelper('nameFormat', function(userID,howlong){
    return nameFormat(userID,howlong);
});
