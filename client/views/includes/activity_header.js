Template.activityHeader.helpers({
  group : function () {
    var group = Session.get("currentGroup");
    var currentUserID = Meteor.userId();
    var TVA;
    if (group) {
      return group;
    } else if (currentUserID) {
      group = [currentUserID];
      Session.set('currentGroup',group);
    } else {
      return [];
    };
  },
  canEditAssessment: function() {
    var cU = Meteor.userId();
    if (!Roles.userIsInRole(cU,['student','teacher'])) return false;
    if (Roles.userIsInRole(cU,'student')) {
      if ((!this.hasOwnProperty('ownerID') || !(this.ownerID == cU) )) return false;      
      if (!this.hasOwnProperty('type') || !this.type == 'assessment') return false;
    };
    if (this.hasOwnProperty('standardIDs') && (LevelsOfMastery.find({activityID:this._id}).count() > 0)) 
      return false;
    //will only check for LoMs that came over with the current subscription.
    //if there are others, it will be caught on the server shen attempting to update
    return true;
  }
});

Template.activityHeader.events({
  'click #btnEdit' : function() {
    var Activity = Activities.findOne(this._id);
    var userToShow = Meteor.userId();
    Session.set('newAssessment',Activity);
    var $title = $('#addAssessmentDialog #title');
    $title.text(Activity.title);
    $title.data('defaultText',Activity.title);

    var $description = $('#addAssessmentDialog #description');
    if (Activity.hasOwnProperty('description') && Activity.description) {
      $description.text(Activity.description);
    } else {
      if (Roles.userIsInRole(userToShow,'teacher')) {
        $description.text('Description (optional)');
      } else {
       $description.text('Explain what you will do to prepare for this reassessment, including meeting with your teacher to discuss a past assessment and which specific lab activities you will do or problems you will solve for individual practice.');
      };
    }
    $description.data('defaultText',$description.html());
    $('#addAssessmentDialog').modal(); 
  }
});
