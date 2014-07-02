Template.studentHeader.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  }
});

Template.studentHeader.events({
  'change #viewAs' : function(event) {
    console.log(event);
    console.log($('#viewAs').val());
    //update viewAs session var
  }
});

/*Template.studentHeader.render = function(){
  $('#viewAs').selectmenu();
};*/

//also Template.studentHeader.render({ 
//  if isTeacher, set viewAs session var

//format:  view
//          as Gwolfe
//          events for everyone
//          as user1
//          events for D block
