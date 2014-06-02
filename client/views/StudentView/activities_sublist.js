Template.activitiesSublist.helpers({
  activities: function() {
    return Activities.find({model: this.model}); 
  }
});
