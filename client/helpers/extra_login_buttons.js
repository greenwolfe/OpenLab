  /***********************/
 /**** LOGIN BUTTONS ****/
/***********************/

Template._loginButtonsLoggedInDropdown.rendered = function() {
  $('#login-buttons-logout').after('<button id="editProfile" name="editProfile" class="btn btn-block">Edit Profile</button>');
};

Template._loginButtonsLoggedInDropdown.events({
  'click #editProfile': function (evt, tmpl) { 
     $('#editProfileDialog').modal(); 
   } 
});

  /**********************/
 /**** EDIT PROFILE ****/
/**********************/

Template.editProfile.events({
  'change #sectionList': function(event,tmpl) {
    var block = $('#sectionList').val();
    var currentUser = Meteor.user();
    console.log(currentUser);
    Meteor.users.update({_id:currentUser._id}, { $set:{"profile.section":block}} );
    console.log(Meteor.user());
  }
});

Template.editProfile.rendered = function() {
  var currentUser = Meteor.user();
  if (currentUser.profile && currentUser.profile.section) {
    $('#sectionList').val(currentUser.profile.section);
  }; //not working because not re-rendered on logout, login as different user
    //would work most of the time for individual users
    //allow teacher to edit student profiles?
};

//continue handler to update user form
