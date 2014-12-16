Meteor.startup(function () {
  if (Site.find().count() == 0) {
    Site.insert({
      title : 'Open Lab',
      activityTypes: ['activity','assessment','reassessment','lab']
    });
  };

  var meetingDays = [{'Mon':1},{'Tue':1},{'Wed':0},{'Thu':2},{'Fri':1}];
  var section = Sections.findOne({section:'Bblock'});
  if (!('meetingDays' in section)) {
    Sections.update(section._id,{$set: {meetingDays: meetingDays}});
  }
  var section = Sections.findOne({section:'Fblock'});
  if (!('meetingDays' in section)) {
    Sections.update(section._id,{$set: {meetingDays: meetingDays}});
  }
  meetingDays = [{'Mon':1},{'Tue':1},{'Wed':2},{'Thu':0},{'Fri':1}];
  var section = Sections.findOne({section:'Gblock'});
  if (!('meetingDays' in section)) {
    Sections.update(section._id,{$set: {meetingDays: meetingDays}});
  }
  


  var RA = {
    title : 'In class.  Attendance Required.',
    modelID : 'wholecourse',
    description : 'You did not complete your open lab schedule, and are required to be in class.  Your teacher will consult with your about what work to do.',
    ownerID: '',
    standardIDs: [],
    visible: true
  }
  if (!Activities.findOne({modelID:RA.modelID,title:RA.title}))
    Activities.insert(RA); 

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

    if (Roles.userIsInRole(user._id,'student') && ('profile' in user) && !('recentGroupies' in user.profile)) {
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