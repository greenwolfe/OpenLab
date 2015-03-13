  /*********************/
 /****  EditGroup  ****/
/*********************/

Template.EditGroup.helpers({
  currentStudentsGroup: function() {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    if ((cU) && ('profile' in cU) && ('recentGroupies' in cU.profile)) {
      return cU.profile.recentGroupies;
    }
    return '';
  },
  sections: function() {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    var section = Session.get('editGroupSelectedSection');
    if (!section && cU && ('profile' in cU) && ('sectionID' in cU.profile)) 
          Session.set('editGroupSelectedSection',cU.profile.sectionID);
    return Sections.find({},{sort: [["section","asc"]]});
  },
  studentsInSection : function () {
    var sectionID = Session.get('editGroupSelectedSection');
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    cU = Meteor.users.findOne(cU);
    if (!cU) return '';
    var uIS = Meteor.users.find({_id: {$ne: cU._id},
      'profile.sectionID': sectionID},
        {sort: [["profile.lastName", "asc"], ["profile.firstName", "asc"]]
    }).fetch(); 
    if (!uIS.length) return '';

    if (cU && ('profile' in cU) && ('recentGroupies' in cU.profile)) {
      uIS.forEach(function(u,i) {
        u.selected = _.contains(cU.profile.recentGroupies,u._id) ? 'selected' : '';
      });
    }
    return uIS; 
  }
});

  /******************************/
 /****  Edit Group Section  ****/
/******************************/

Template.editGroupSection.events({
  'click a' : function(event) {
    Session.set('editGroupSelectedSection',this._id);
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

Template.editGroupSection.helpers({
  selected: function() {
    return (Session.get('editGroupSelectedSection') == this._id) ? 'selected' : '';
  }
})

  /******************************/
 /****  Edit Group Student  ****/
/******************************/

Template.editGroupStudent.helpers({
  fullname : function() { //edit when users add names to profile
    if (('profile' in this) && ('firstName' in this.profile) && ('lastName' in this.profile)) {
      return this.profile.firstName + ' ' + this.profile.lastName;
    }
    return this.username;
  }
})

Template.editGroupStudent.events({
  'click a' : function(event) {;
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    Meteor.call('toggleGroupie',this._id,cU);
    event.preventDefault();
    event.stopImmediatePropagation();    
  }
});