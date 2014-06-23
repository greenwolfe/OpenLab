Template.activityHeader.helpers({
  group : function () {
    var group = Session.get("currentGroup");
    var currentUserId = Meteor.userId();
    console.log(group);
    console.log(currentUserId);
    if (group) {
      console.log('group returned true');
      return group;
    } else if (currentUserId) {
      console.log('group returned false, currentUser returned true');
      group = [currentUserId];
      Session.set("currentGroup",group);
      return group;
    } else {
      console.log('both group and currentUser returned false');
      Router.go('/');
    };
  },
});
