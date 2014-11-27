Meteor.startup(function () {
  Meteor.users.find().forEach(function(user) {
    if (Roles.userIsInRole(user._id,'student')) { //} && !user.hasOwnProperty('LoMs')) {
      var LoMs = [];
      Standards.find({visible:true}).forEach(function(standard) {
        var LoM = mostRecent(standard._id,user._id,null);
        if (LoM)
          LoMs.push({standardID:standard._id,level:LoM})
      });
      Meteor.users.update({_id:user._id}, {$set:{LoMs:LoMs}})
    }  
  });
});