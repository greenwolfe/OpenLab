  /*************************/
 /****  TeacherViewAs  ****/
/*************************/

Template.TeacherViewAs.helpers({
  sections: function() {
    var TVA = Session.get('TeacherViewAs');
    var sections = Sections.find().fetch();
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser = Meteor.users.findOne(TVA);
    var selectedSectionID;
    if (selectedUser && selectedUser.profile && selectedUser.profile.sectionID) {
        selectedSectionID = selectedUser.profile.sectionID;
    } else if (_.contains(SectionIDs,TVA)) {
      selectedSectionID = TVA;
    }
    sections.forEach(function(s,i) {
      s.selected = (s._id == selectedSectionID) ? 'selected' : '';
    });   
    return sections; 
  },
  usersInSection : function () {
    var TVA = Session.get('TeacherViewAs');
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser = Meteor.users.findOne(TVA);
    var uIS; //users In Section
    if (TVA == Meteor.userId())
      return '';
    if (_.contains(SectionIDs,TVA)) {
      uIS = Meteor.users.find({_id: {$ne: Meteor.userId()},
        'profile.sectionID': TVA}).fetch(); 
    } else if (selectedUser && selectedUser.profile && selectedUser.profile.sectionID) {
      uIS =  Meteor.users.find({_id: {$ne: Meteor.userId()},
        'profile.sectionID': selectedUser.profile.sectionID}).fetch();
    }; 
    if (!uIS.length) return '';
    uIS.forEach(function(u,i) {
      u.selected = (u._id == TVA) ? 'selected' : '';
    });
    return uIS;
  },
  currentUserSelected : function() {
    var TVA = Session.get('TeacherViewAs');
    return (TVA == Meteor.userId()) ? 'selected' : '';
  },
  SelectedText : function() {
    var TVA = Session.get('TeacherViewAs');
    var SectionIDs = Sections.find().map(function(s) {return s._id});
    var selectedUser = Meteor.users.findOne(TVA);
    var selectedSection;
    if (selectedUser) {
      if (selectedUser.profile && selectedUser.profile.sectionID) {
        selectedSection = Sections.findOne(selectedUser.profile.sectionID).section;
        return selectedUser.username + ' from ' + selectedSection;
      }
      return selectedUser.username;
    };
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
    Session.set('currentGroup',[TVA]);
    if (_.contains(SectionIDs,TVA)) {
      Session.set('visibleWorkplaces',['inClass']);
    } else {
      Session.set('visibleWorkplaces',['inClass','outClass','home'])
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

Deps.autorun(function() {  //set TeacherViewAs when teacher logs in.
  var userID = Meteor.userId();
  Session.set('visibleWorkplaces',['inClass','outClass','home']);
  if (userID && Roles.userIsInRole(userID,'teacher')) {
    Session.set('TeacherViewAs',userID);
  };
});

//hide menu on mouseout?
