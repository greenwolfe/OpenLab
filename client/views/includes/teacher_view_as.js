  /*************************/
 /****  TeacherViewAs  ****/
/*************************/

Template.TeacherViewAs.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  }
});

Template.TeacherViewAs.events({
  'change #viewAs' : function(event) {
    Session.set('TeacherViewAs',$('#viewAs').val());
  }
});

//NOTE:  /client/helpers/users.js sets TeacherViewAs to Meteor.userId() on teacher login


  /************************/
 /****  USER TO VIEW  ****/
/************************/

Template.userToView.rendered = function() { //keep state of select menu consistent with session variable 
//I think this is a non-reactive context so is set on render, but not double-called on change #viewAs event above
  var $option = $(this.find('option'));
  $option.prop('selected',($option.val() == Session.get('TeacherViewAs')));
};
