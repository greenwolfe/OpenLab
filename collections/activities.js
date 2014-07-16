Activities = new Meteor.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
  // only allow adding activities if you are logged in
  // must alter this to only allow teacher to add activities
  return !! userId;
  }
}); 

  /* Activities.insert({
    title : 'Acceleration Intro',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : ''
    rank : 0
  }); */
//models and activities need a rank and a way to update that rannk
//methods:  placebefore, placeafter ... redo as integers on server only?
Meteor.methods({
  /*removeAllActivities: function() {
    return Activities.remove({});
  },*/

  /***** POST ACTIVITY ****/
  postActivity: function(Activity,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var ActivityId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post an activity");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to post an activity.')
    
    if (!Activity.title || (Activity.title == defaultText) || (Activity.title == ''))
      throw new Meteor.Error(413, "Cannot post activity.  Missing title.");

    if (!Activity.modelID)
      throw new Meteor.Error(402, "Cannot post activity.  Missing model.");
   
    model = Models.findOne(Activity.modelID);
    if (!model)
       throw new Meteor.Error(421, "Cannot post activity.  Improper model.")

    ActivityID = Activities.insert(Activity);

    return ActivityID; 
  },  

  /***** DELETE ACTIVITY ****/
  deleteActivity: function(ActivityID) { 
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete an activity");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to delete an activity.')
  
    if (!Activity)
      throw new Meteor.Error(412, "Cannot delete activity.  Invalid ID.");
    
    Activities.remove(ActivityID);
    
    return ActivityID;
  }, 

  /***** UPDATE ACTIVITY ****/
  updateActivity: function(nA) { //newActivity
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(nA._id);
    var maxRank,r,currentModelID;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update an activity");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to update an activity.')
  
    if (!Activity)
      throw new Meteor.Error(412, "Cannot update activity.  Invalid ID.");
    currentModelID = Activity.modelID;

    if (nA.title && (nA.title != Activity.title) && nA.title != '') 
      Activities.update(nA._id,{$set: {title: nA.title}});

    if (nA.hasOwnProperty('description') && (nA.description != Activity.description)) 
      Activities.update(nA._id,{$set: {description: nA.description}});
    
    if (nA.modelID && (nA.modelID != Activity.modelID) && nA.modelID != '') {
      model = Models.findOne(nA.modelID);
      if (!model)
        throw new Meteor.Error(421, "Cannot update activity.  Improper model.")
      maxRank = _.max(Activities.find({modelID: nA.modelID}).map(function(a) {return a.rank}))
      Activities.update(nA._id,{$set: {modelID: nA.modelID,rank: maxRank+1}});
      Activity.modelID = nA.modelID; 
      if (Meteor.isServer) {  //user server to re-rank using integers
        r = 0;
        Activities.find({modelID: currentModelID},{sort: {rank: 1}}).forEach(function(a) {
          Activities.update(a._id,{$set: {rank:r}});
          r++;
        });
      }; 
    };

    
    if (nA.hasOwnProperty('rank') && (nA.rank != Activity.rank)) {
      Activities.update(nA._id,{$set: {rank: nA.rank}}); 
      if (Meteor.isServer) { //use server to re-rank using integers
        var r = 0;
        Activities.find({modelID: Activity.modelID},{sort: {rank: 1}}).forEach(function(a) {
          Activities.update(a._id,{$set: {rank:r}});
          r++;
        });
      }; 
    };

    return Activity._id;
  } 
});  

if (Meteor.isServer) {
if (Activities.find().count() === 0) {
  Activities.insert({
    title : 'Acceleration Intro',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 0
  });

  Activities.insert({
    title : 'Problem-solving with the Velocity Graph',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 1
  }); 

  Activities.insert({
    title : 'Olympic Event - Designer Ramp',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 2
  });

  Activities.insert({
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 3
  });

  Activities.insert({
    title : 'Model Summary',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 4
  });

  Activities.insert({
    title : 'Olympic Event - Hole in One',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 5
  });

  Activities.insert({
    title : 'Broom Ball Review',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 0
  });

  Activities.insert({
    title : 'Force Diagrams for Stationary Objects',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 1
  });

  Activities.insert({
    title : 'Force Diagrams for Moving Objects',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 2
  });

  Activities.insert({
    title : 'Weight vs. Mass Lab',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 3
  });

  Activities.insert({
    title : 'Statics with Horizontal and Vertical Forces',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 4
  });

  Activities.insert({
    title : 'Statics with Forces at Angles',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 5
  });

  Activities.insert({
    title : 'Olympic Event - Stuffed Animals',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 6
  });

  Activities.insert({
    title : 'Dueling Forces',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 7
  });

  Activities.insert({
    title : 'Model Summary',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 8
  });
};
};
