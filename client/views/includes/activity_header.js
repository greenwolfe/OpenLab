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
    Session.set('newAssessment',Activities.findOne(this._id));
    $('#addAssessmentDialog').modal(); 
  }
});
