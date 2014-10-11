var nameFormat = function (userID,howlong) {
  var user = Meteor.users.findOne(userID);
  var fullName = '';
  if (!user) return '';
  if (howlong == 'full') {
    if (user.hasOwnProperty('profile') && user.profile.hasOwnProperty('firstName')) 
      fullName = user.profile.firstName + ' ';
    if (user.hasOwnProperty('profile') && user.profile.hasOwnProperty('lastName'))
      fullName += user.profile.lastName;
    return fullName ? fullName : user.username;
  } else if (howlong == 'first') {
    if (user.hasOwnProperty('profile') && user.profile.hasOwnProperty('firstName')) 
      fullName = user.profile.firstName + ' ';
    return fullName ? fullName : user.username;
  } else if (howlong == 'nick') {
    return user.username;
  }
};

UI.registerHelper('nameFormat', function(userID,howlong){
    return nameFormat(userID,howlong);
});
