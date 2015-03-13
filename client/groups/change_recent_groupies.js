Template.changeGroupies.events({
  'click i.remove, click #changeGroupiesReturn' : function(event) {
    $('#changeGroupiesDialog').modal('hide');
    //also return selections to defaults if not changing group?
    $('#joinGroupDialog').modal();
  },
  'click .tab-content .tab-pane p' : function(event) {
    var userID = $(event.target).data('id');
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    Meteor.call('toggleGroupie',userID,cU);
  }
});

Template.changeGroupies.helpers({
  recentGroupies: function() {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    if (!cU || !('profile' in cU) || !('recentGroupies' in cU.profile))
      return '';
    return cU.profile.recentGroupies;
  },
  sections: function() {
    var sections = Sections.find({},{sort: [["section","asc"]]}).fetch();
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    if (cU && ('profile' in cU) && ('sectionID' in cU.profile)) {
      sections.forEach(function(s,i) {
        s.active = ((s._id == cU.profile.sectionID)) ? 'active' : '';
      });
    }
    return sections;
  },
  usersInSection : function () {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    if (!cU) return '';
    var uIS = Meteor.users.find({_id: {$ne: cU._id},
      'profile.sectionID': this._id},
        {sort: [["profile.lastName", "asc"], ["profile.firstName", "asc"]]
    }).fetch(); 
    if (!uIS.length) return '';

    if (cU && ('profile' in cU) && ('recentGroupies' in cU.profile)) {
      uIS.forEach(function(u,i) {
        u.selected = _.contains(cU.profile.recentGroupies,u._id) ? 'ui-state-highlight' : 'ui-state-default';
      });
    }
    return uIS; 
  }
});