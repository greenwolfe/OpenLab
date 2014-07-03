Template.studentHeader.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  }
});

Template.studentHeader.events({
  'change #viewAs' : function(event) {
    console.log(event);
    console.log($('#viewAs').val());
    Session.set('TeacherViewAs',$('#viewAs').val());
  }
});

Template.studentHeader.rendered = function() {
  if (Roles.userIsInRole(Meteor.userId(),'teacher')) {
    Session.setDefault('TeacherViewAs',Meteor.userId());
  };
};
