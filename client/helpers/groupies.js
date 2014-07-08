var groupies = function (initialStrSingular,initialStrPlural,group,finalStrSingular,finalStrPlural) {  
    var groupies = initialStrPlural;
    var i, userID,user;
    if (!Array.isArray(group)) return "";
    if (!group) return "";
    if (!Meteor.users.find().count()) return "";
    
    if (group.length == 1) {
     if (Meteor.users.findOne(group[0])) {
       return initialStrSingular + Meteor.users.findOne(group[0]).username + finalStrSingular;
     } else {
        return "";
     };
    }
    for (i = 0; i < group.length; i++) {
      userID = group[i];
      user = Meteor.users.findOne(userID);
      if (!!user) {
        groupies += user.username;
      } else {
        groupies += 'invalid user?';
      };
      if (i == group.length - 2) {
        groupies += ' and ';
      } else if (i < group.length - 2) {
        groupies += ', ';
      };
    }; 
    return groupies + finalStrPlural;
}; 

UI.registerHelper('groupies', function(initialStrSingular, initialStrPlural,group,finalStrSingular,finalStrPlural){
    return groupies(initialStrSingular, initialStrPlural,group,finalStrSingular,finalStrPlural);
});
