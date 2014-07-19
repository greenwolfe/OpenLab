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

Deps.autorun(function() {  //set TeacherViewAs when teacher logs in.
  var userID = Meteor.userId();
  Session.set('visibleWorkplaces',['inClass','outClass','home']);
  if (userID && Roles.userIsInRole(userID,'teacher')) {
    Session.set('TeacherViewAs',userID);
  };
});

//keep section highlighted when returning to menu?
//hook menu open event?
//hide menu on mouseout?
/*Template.sectionToView.rendered = function(event) {
    var $li = $(this.find('li'));
    var $a = $(this.find('a'));
    if ($a.data('value') == Session.get('TeacherViewAs')) {
      $li.addClass('active'); //adding active class to li works
    } else {
      $li.removeClass('active');
    };
    console.log($li);

}; */