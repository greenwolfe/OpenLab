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
    };  

    if (Roles.userIsInRole(user,'student') && user.hasOwnProperty('completedActivities')) {
      Activities.find({visible:true}).forEach(function(activity){
        var hasActivityStatusField = user.hasOwnProperty('activityStatus');
        if (hasActivityStatusField && _.findWhere(user.activityStatus,{_id:activity._id})) 
          return;        
        if (_.contains(user.completedActivities,activity._id)) {
          Meteor.users.update(user._id,{$push: {activityStatus: {_id:activity._id,status:'done'} }});
        }      
      });
    };

    if (Roles.userIsInRole(user._id,'student') ) {
      var recentGroupies = [];
      var groups = CalendarEvents.find({group : {$in : [user._id]}},
        {$sort : {eventDate: -1}}).map(function(cE) {
          return cE.group;
      });
      groups.every(function(group) {
        recentGroupies = _.union(recentGroupies,group);
        return (recentGroupies.length >= 6);
      });
      recentGroupies = _.without(recentGroupies,user._id);
      var recentGroupiesNames = recentGroupies.map(function(groupie) {
        return Meteor.users.findOne(groupie).username;
      })
      Meteor.users.update(user._id,{$set: {'profile.recentGroupies': recentGroupies }});
    };
  });
});