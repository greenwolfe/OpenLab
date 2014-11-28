Meteor.startup(function () {
  Meteor.users.find().forEach(function(user) {
    if (Roles.userIsInRole(user._id,'student') && !user.hasOwnProperty('LoMs')) {
      var LoMs = [];
      Standards.find({visible:true}).forEach(function(standard) {
        var LoM = mostRecent(standard._id,user._id,null);
        if (LoM)
          LoMs.push({standardID:standard._id,level:LoM})
      });
      Meteor.users.update({_id:user._id}, {$set:{LoMs:LoMs}})
    }  

    if (Roles.userIsInRole(user,'student') && user.hasOwnProperty('completedActivities')) {
      Activities.find({visible:true}).forEach(function(activity){
        var hasActivityStatusField = user.hasOwnProperty('activityStatus');
        if (hasActivityStatusField && _.findWhere(user.activityStatus,{_id:activity._id})) 
          return;        
        if (_.contains(user.completedActivities,activity._id)) {
          Meteor.users.update(user._id,{$push: {activityStatus: {_id:activity._id,status:'done'} }});
        }      
      });
    }
  });
});