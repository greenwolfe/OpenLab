  /***************************/
 /***** VIRTUAL WORK ********/
/***************************/

Template.virtualWork.helpers({
  sections: function() {
    var TVA = Session.get('TeacherViewAs');
    var sectionIDs = Sections.find().fetch().map(function(s) { return s._id })
    if (_.contains(sectionIDs,TVA)) {
      return Sections.find(TVA);
    } else {
      var student = Meteor.users.findOne(TVA);
      if ((student) && ('profile' in student) && ('sectionID' in student.profile)) 
        if (_.contains(sectionIDs,student.profile.sectionID)) 
          return Sections.find(student.profile.sectionID)
    }
    return Sections.find();
  },
  groupsInClass: function() {
    var TVA = Session.get('TeacherViewAs');
    var students = Meteor.users.find(TVA).fetch();
    if ((!students.length) || (!Roles.userIsInRole(students[0],'student')))
      students = Meteor.users.find({'profile.sectionID':this._id}).fetch();
    var groups = [];
    var alreadyChosen = [];
    students.forEach(function(student) {
      if (_.contains(alreadyChosen,student._id))  return;
      alreadyChosen = alreadyChosen.concat(student._id);
      var group = [student];
      if (('profile' in student) && ('recentGroupies' in student.profile)) {
        student.profile.recentGroupies.forEach(function(groupie) {
          if (_.contains(alreadyChosen,groupie))  return;
          alreadyChosen = alreadyChosen.concat(groupie);
          group = group.concat(Meteor.users.findOne(groupie));
        })
      }
      groups.push({'students': group});
    });
    return groups;
  }
});

  /**********************************/
 /***** GROUPS VIRTUAL WORK ********/
/**********************************/

Template.groupsVirtualWork.helpers({
  virtualWorkStatus: function() {
    var validStata = ['icon-virtual-work','icon-raise-virtual-hand','icon-virtual-help'];
    var student = Meteor.users.findOne(this._id);
    if (!student || !Roles.userIsInRole(student,'student'))
      return 'icon-virtual-work'
    if ( ('profile' in student) && ('virtualWorkStatus' in student.profile) &&
        _.contains(validStata,student.profile.virtualWorkStatus) ) {
        return student.profile.virtualWorkStatus;
    } else {
      Meteor.call('toggleVirtualWorkStatus',student._id,function(error, id) {
        if (error) return alert(error.reason);
      });
      return 'icon-virtual-work';    
    }
  }
});

Template.groupsVirtualWork.events({
  'click i.icon-virtual-work, click i.icon-raise-virtual-hand, click i.icon-virtual-help': function(event,tmpl) {
    Meteor.call('toggleVirtualWorkStatus',this._id,function(error, id) {
      if (error) return alert(error.reason);
    });
  }
});

