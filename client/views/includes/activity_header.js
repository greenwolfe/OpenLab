Template.activityHeader.helpers({
  group : function () {
    var group = Session.get("currentGroup");
    var currentUserID = Meteor.userId();
    var TVA;
    if (group) {
      return group;
    } else if (currentUserID) {
      group = [currentUserID];
      Session.set('currentGroup',group);
    } else {
      return [];
    };
  }
});
