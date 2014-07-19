  /*************************/
 /****  TeacherViewAs  ****/
/*************************/

Template.TeacherViewAs.helpers({
  sections: function() {
    return Sections.find();
  },
  usersInSection : function () {
    var TVA = Session.get('TeacherViewAs');
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser;
    if (TVA == Meteor.userId())
      return '';
    if (_.contains(SectionIDs,TVA))
      return Meteor.users.find({_id: {$ne: Meteor.userId()},
        'profile.sectionID': TVA}); 
    selectedUser = Meteor.users.findOne(TVA);
    if (selectedUser)
      return Meteor.users.find({_id: {$ne: Meteor.userId()},
        'profile.sectionID': selectedUser.profile.sectionID}); 
    return '';
  },
  SelectedText : function() {
    var TVA = Session.get('TeacherViewAs');
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser = Meteor.users.findOne(TVA);
    if (selectedUser) return selectedUser.username;
    if (_.contains(SectionIDs,TVA)) {
      return Sections.findOne(TVA).section;
    }
  }
});

Template.TeacherViewAs.events({
  'click #viewAs li > a' : function(event) {
    var TVA = $(event.target).data('value');
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    Session.set('TeacherViewAs',TVA);
    if (_.contains(SectionIDs,TVA)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
});

Deps.autorun(function() {
  var userID = Meteor.userId();
  if (userID && Roles.userIsInRole(userID,'teacher')) {
    Session.set('TeacherViewAs',userID);
  };
});

/*Template.sectionToView.rendered = function(event) {
  var $a = $(this.find('option'));
  if ($a.data('value') == Session.get('TeacherViewAs')) {
    $a.addClass('active');
  } else {
    $a.removeClass('active');
  };
}; */