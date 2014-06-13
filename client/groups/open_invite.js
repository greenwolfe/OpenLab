Template.openInvite.helpers({
  groupies : function() {
    var group = _.without( this.invite.concat(this.group), Meteor.userId() );
    var groupies = "";
    var i;
    if (group.length == 1) {
      return Meteor.users.findOne(group[0]).username + ' has';
    } else {
      for (i = 0; i < group.length; i++) {
        userID = group[i];
        groupies += Meteor.users.findOne(userID).username;
        if (i == group.length - 2) {
          groupies += ' and ';
        } else if (i < group.length - 2) {
          groupies += ', ';
        };
      }; 
      return groupies + ' have';
    }
 
  }
});
