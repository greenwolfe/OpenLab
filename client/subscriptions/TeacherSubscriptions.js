Deps.autorun(function() {
  var userID = Meteor.userId();
  var userToShow = userID;
  if (Roles.userIsInRole(userToShow,'teacher')) {
    userToShow = Session.get('TeacherViewAs');
    Meteor.subscribe('calendarEvents',[userToShow,'_ALL_']),
    Meteor.subscribe('links',[userToShow,'_ALL_']),
    Meteor.subscribe('notes',[userToShow,'_ALL_']),
    Meteor.subscribe('notesByAuthor',userID),
    Meteor.subscribe('todos',[userToShow,'_ALL_'])
  };
});
