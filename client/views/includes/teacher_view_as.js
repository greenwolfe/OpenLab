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
  }
});

Template.TeacherViewAs.events({
  'change #viewAs' : function(event) {
    TVA = $('#viewAs').val();
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    Session.set('TeacherViewAs',$('#viewAs').val());
    if (_.contains(SectionIDs,TVA)) {
      //research shows no way to keep select menu open
    }
  }
});

Deps.autorun(function() {
  var userID = Meteor.userId();
  if (userID && Roles.userIsInRole(userID,'teacher')) {
    Session.set('TeacherViewAs',userID);
  };
});

  /************************/
 /****  USER TO VIEW  ****/
/************************/

Template.userToView.rendered = function() { //keep state of select menu consistent with session variable 
//I think this is a non-reactive context so is set on render, but not double-called on change #viewAs event above
  var $option = $(this.find('option'));
  $option.prop('selected',($option.val() == Session.get('TeacherViewAs')));
};
