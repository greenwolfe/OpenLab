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
    var sectionID = $('#sectionList').val();
    var currentUser = Meteor.user();
    Meteor.users.update({_id:currentUser._id}, { $set:{"profile.sectionID":sectionID}} );
  }
});

Template.editProfile.helpers({
  Sections: function() {
    return Sections.find();
  },
});

//allow teacher to view/edit student profiles?

  /************************/
 /**** SECTION OPTION ****/
/************************/

Template.sectionOption.helpers({
  selectIfCurrentSection: function() {
    var currentUser = Meteor.user();
    if (currentUser && currentUser.profile && currentUser.profile.sectionID && (currentUser.profile.sectionID == this._id) ) {
      return 'selected';
    } else {
      return '';
    }
  }
});
  /************************/
 /**** CHOOSE SECTION ****/
/************************/

Template.chooseSection.helpers({
  Sections: function() {
    return Sections.find();
  },
});

Template.chooseSection.events({
  'change #CSsectionList': function(event,tmpl) {
    var sectionID = $('#CSsectionList').val();
    var currentUser = Meteor.user();
    Meteor.users.update({_id:currentUser._id}, { $set:{"profile.sectionID":sectionID}} );
    $('#chooseSectionDialog').modal('hide');
  }
});

Deps.autorun(function() {
  var userID = Meteor.userId();
  if (userID && Roles.userIsInRole(userID,'student')) {
    currentUser = Meteor.user(userID);
    if (!currentUser.profile || !currentUser.profile.sectionID) {
      $('#chooseSectionDialog').modal(); 
    };
  };
});
