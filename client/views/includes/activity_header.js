Template.activityHeader.helpers({
  group : function () {
    var group = Session.get("currentGroup");
    var currentUserID = Meteor.userId();
    var TVA;
    if (group) {
      return group;
    } else if (currentUserId) {
      group = [currentUserId];
      Session.set('currentGroup',group);
    } else {
      return [];
    };
  }
});
