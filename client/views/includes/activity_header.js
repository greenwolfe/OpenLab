Template.activityHeader.helpers({
  group : function () {
    var group = Session.get("currentGroup");
    var currentUserId = Meteor.userId();
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
