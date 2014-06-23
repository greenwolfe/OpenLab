var groupies = function (initialStrSingular,initialStrPlural,group,finalStrSingular,finalStrPlural) {  
    var group = group || [];
    var groupies = initialStrPlural;
    var i, userID;
    if (group.length == 0) return "";
    
    if (group.length == 1) return initialStrSingular + Meteor.users.findOne(group[0]).username + finalStrSingular;
    for (i = 0; i < group.length; i++) {
      userID = group[i];
      groupies += Meteor.users.findOne(userID).username;
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
