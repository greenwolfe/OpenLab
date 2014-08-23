Deps.autorun(function() {
  var TVA = Session.get('TeacherViewAs');
  var currentUser = Meteor.user();
  var sectionID = (currentUser && 
    currentUser.hasOwnProperty('profile') && 
    currentUser.profile.hasOwnProperty(sectionID)) ? currentUser.profile.sectionID : '';
  var teacherViewIDs;
  if (!currentUser) {
    Session.set('TeacherViewIDs',['_ALL_']);
    return;
  }
  if (Roles.userIsInRole(currentUser._id,'student')) 
    Session.set('TeacherViewIDs',
      [currentUser._id,sectionID,'_ALL_']);
  if (Roles.userIsInRole(currentUser,'teacher')) {
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser = Meteor.users.findOne(TVA);
    if (TVA == currentUser._id) {
      Session.set('TeacherViewIDs',
        [TVA,'_ALL_'].concat(SectionIDs));
    } else if (_.contains(SectionIDs,TVA)) {
      teacherViewIDs = Meteor.users.find({_id: {$ne: currentUser._id},
      'profile.sectionID': TVA}).map(function(u) {return u._id}); 
      teacherViewIDs = teacherViewIDs.concat([TVA,'_ALL_']);
      Session.set('TeacherViewIDs',teacherViewIDs)
    } else if (selectedUser) {
      Meteor.subscribe('completedActivities',TVA);
      Session.set('TeacherViewIDs',
        [TVA,selectedUser.profile.sectionID,'_ALL_']);
    } else {
      Session.set('TeacherViewIDs',['_ALL_']);
    };
  };
}); 



//why am I not subscribing to links and todos by author?
Deps.autorun(function() {
  var userID = Meteor.userId();
  var userToShow = Session.get('TeacherViewIDs');
  if (userID && Roles.userIsInRole(userID,'teacher') && userToShow) {
    Meteor.subscribe('activities',true), //showHidden = true
    Meteor.subscribe('models',true),
    Meteor.subscribe('standards',true),
    Meteor.subscribe('calendarEvents',userToShow),
    Meteor.subscribe('links',userToShow),
    Meteor.subscribe('notes',userToShow),
    Meteor.subscribe('notesByAuthor',userID),
    Meteor.subscribe('todos',userToShow)
  };
});
