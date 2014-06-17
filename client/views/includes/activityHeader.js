Template.activityHeader.helpers({
  group : function () {
    return Session.get("currentGroup") || [];
  },
});
