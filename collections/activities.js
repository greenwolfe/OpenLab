Activities = new Meteor.Collection('activities');

  /* Activities.insert({
    title : 'Acceleration Intro',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    ownerID: '',
    standardIDs: [],
    rank : 0,
    visible: true,
    LoMs: {standardID:LoM,standardID:LoM, ...}, //for a particular user ... calculated according to standard's calcMethod ... added temporarily in publication, not in database
  }); */

Meteor.methods({
  /*removeAllActivities: function() {
    return Activities.remove({});
  },*/

  /***** POST ACTIVITY ****/
  postActivity: function(Activity,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var ActivityId,maxRank,ranks;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post an activity");

    if (!Activity.hasOwnProperty('ownerID'))
      Activity.ownerID = '';
    
    if (!Roles.userIsInRole(cU,'teacher') && (cU._id != Activity.ownerID))
      throw new Meteor.Error(409, 'Only teachers can post activities for the whole class.')
    
    if (!Activity.title || (Activity.title == defaultText) || (Activity.title == ''))
      throw new Meteor.Error(413, "Cannot post activity.  Missing title.");

    if (!Activity.modelID)
      throw new Meteor.Error(402, "Cannot post activity.  Missing model.");
   
    model = Models.findOne(Activity.modelID);
    if (!model)
       throw new Meteor.Error(421, "Cannot post activity.  Improper model.")

    if (!Activity.hasOwnProperty('description'))
      Activity.description = '';

    if (!Activity.hasOwnProperty('standardIDs'))
      Activity.standardIDs = [];

    if (Activity.hasOwnProperty('dueDate') && Activity.dueDate) {
      if (!moment(Activity.dueDate,'ddd[,] MMM D YYYY',true).isValid())
        throw new Meteor.Error(414,'Cannot add/change due date. Invalid date');
    } else {
      Activity.dueDate = null;    
    };

    if (!Activity.hasOwnProperty('visible'))
      Activity.visible = true;
    
    ranks = Activities.find({modelID: Activity.modelID}).map(function(a) {return a.rank});
    if (ranks.length) {
      maxRank = _.max(ranks)
    } else {
      maxRank = -1;
    }
    if (!Activity.hasOwnProperty('rank'))
      Activity.rank = maxRank + 1;

    ActivityID = Activities.insert(Activity);

    return ActivityID; 
  },  

  /***** DELETE ACTIVITY ****/
  deleteActivity: function(ActivityID) { 
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete an activity");

    if (!Activity)
      throw new Meteor.Error(412, "Cannot delete activity.  Invalid ID.");

    if (!Roles.userIsInRole(cU,'teacher') && (cU._id != Activity.ownerID))
      throw new Meteor.Error(409, 'You must be a teacher to delete a whole class activity.')
      
    //check if activity has been used and post warning or suggest
    //just hiding it???

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

    if (!Activity)
      throw new Meteor.Error(412, "Cannot update activity.  Invalid ID.");
    currentModelID = Activity.modelID;

    if (!Roles.userIsInRole(cU,'teacher') && (cU._id != Activity.ownerID))
      throw new Meteor.Error(409, 'You must be a teacher to update a whole class activity.')

    if (nA.title && (nA.title != Activity.title) && nA.title != '') 
      Activities.update(nA._id,{$set: {title: nA.title}});

    if (nA.hasOwnProperty('description') && (nA.description != Activity.description)) 
      Activities.update(nA._id,{$set: {description: nA.description}});

    if (nA.hasOwnProperty('dueDate')) {
      if (moment(nA.dueDate,'ddd[,] MMM D YYYY',true).isValid()) {
        Activities.update(nA._id,{$set: {dueDate: nA.dueDate}});
      } else {
        Activities.update(nA._id,{$set: {dueDate: null}});
      };
    }

    if (nA.hasOwnProperty('visible') && (nA.visible != Activity.visible)) 
      Activities.update(nA._id,{$set: {visible: nA.visible}});
    
    if (nA.modelID && (nA.modelID != Activity.modelID) && nA.modelID != '') {
      model = Models.findOne(nA.modelID);
      if (!model)
        throw new Meteor.Error(421, "Cannot update activity.  Improper model.")
      maxRank = _.max(Activities.find({modelID: nA.modelID}).map(function(a) {return a.rank}))
      Activities.update(nA._id,{$set: {modelID: nA.modelID,rank: maxRank+1}});
      Activity.modelID = nA.modelID;  
    };

    
    if (nA.hasOwnProperty('rank') && (nA.rank != Activity.rank)) {
      Activities.update(nA._id,{$set: {rank: nA.rank}}); 
    };

    return Activity._id;
  },

  /**** ACTIVITY ADD STANDARD ****/
  activityAddStandard: function(ActivityID,standardID) {
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);
    var Standard = Standards.findOne(standardID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to add a standard to an assessment");

    if (!Activity)
      throw new Meteor.Error(412, "Cannot add standard to assessment.  Invalid assessment ID.");

    if (!Roles.userIsInRole(cU,'teacher') && (cU._id != Activity.ownerID))
      throw new Meteor.Error(409, 'You must be a teacher to add a standard to an assessment that belongs to anther user.')

    if (!Standard)
      throw new Meteor.Error(430, "Cannot add standard, invalid ID.")
    
    Activities.update(ActivityID,{$addToSet: {standardIDs: standardID}});
  },

  /**** ACTIVITY REMOVE STANDARD ****/
  activityRemoveStandard: function(ActivityID,standardID) {
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);
    var Standard = Standards.findOne(standardID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to remove a standard from an assessment");

    if (!Activity)
      throw new Meteor.Error(412, "Cannot remove standard from assessment.  Invalid assessment ID.");

    if (!Roles.userIsInRole(cU,'teacher') && (cU._id != Activity.ownerID))
      throw new Meteor.Error(409, 'You must be a teacher to remove a standard from an assessment that belongs to another user.')

    if (!Standard)
      throw new Meteor.Error(430, "Cannot remove standard, invalid ID.")
    
    Activities.update(ActivityID,{$pull: {standardIDs: standardID}});
  }, 

  /**** ACTIVITY INCREMENT STATUS ****/
  activityIncrementStatus: function(ActivityID,StudentID,Increment) {
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);
    var student = Meteor.users.findOne(StudentID);
    var statuses = ['notStarted','oneBar','twoBars','threeBars','fourBars','fiveBars','submitted','returned','done']
    var currentStatus;
    var newStatus;
    var Index;

    if (_.isFinite(Increment) && (Increment != 0)) {
      Increment = (Increment > 0) ? 1 : -1;
    } else {
      throw new Meteor.Error(500, "Invalid increment.  Can only increment activity's status by +/- 1.")
    }

    if (!cU)
      throw new Meteor.Error(401, "You must be logged in to increment an activity's status");
    
    if (!Activity) 
      throw new Meteor.Error(412, "Cannot increment activity's status.  Invalid activity");

    if (!student)
      throw new Meteor.Error(425, "Cannot increment activity's status.  Invalid user.")

    if (!Roles.userIsInRole(student,'student')) 
      throw new Meteor.Error(426, "Cannot increment activity's status.  Not a student.")

    if (Roles.userIsInRole(cU,'student') && !(cU._id == student._id))
      throw new Meteor.Error(427, "A student can only change their own status for an activity.")

    if (student.hasOwnProperty('activityStatus')) 
      currentStatus = _.findWhere(student.activityStatus,{_id:ActivityID});
    var hasCurrentStatus = !!currentStatus;
    if (!hasCurrentStatus) {
      if (student.hasOwnProperty('completedActivities') && (_.indexOf(student.completedActivities,ActivityID) + 1)) {
        currentStatus = { //converts status from old system
          _id: ActivityID,
          status: 'done'
        };
      } else {
        currentStatus = {
          _id: ActivityID,
          status: 'notStarted'
        };  
      };   
    };

    Index = _.indexOf(statuses,currentStatus.status);
    if (Roles.userIsInRole(cU,'teacher')) {
      newStatus = Math.max(0,Math.min(8,Index + Increment));
    } else if (Roles.userIsInRole(cU,'student')) {
      if (Index > 7) return; //teacher does final check, student cannot change
      newStatus = Math.max(0,Math.min(6,Index + Increment));
    } else {
      throw new Meteor.Error(428, "You must be a student or a teacher to change an activity's status.")
    }

    if (newStatus != Index) {
      newStatus = statuses[newStatus]; 
      if (hasCurrentStatus) {
        Meteor.users.update({_id:StudentID,"activityStatus._id":ActivityID},{$set : {"activityStatus.$.status":newStatus}});
      } else {
        currentStatus.status = newStatus;
        Meteor.users.update(StudentID,{$push: {activityStatus: currentStatus}});
      };
    }
  },

  /**** ACTIVITY MARK NOT DONE ****/
  activityMarkNotDone: function(ActivityID,StudentIDs) {
    var cU = Meteor.user(); //currentUser
    var Activity = Activities.findOne(ActivityID);
    if (!_.isArray(StudentIDs))
      StudentIDs = [StudentIDs];

    if (!cU)
      throw new Meteor.Error(401, "You must be logged in to mark an activity as done");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, "Only teachers may mark an activity as done");

    if (!Activity) 
      throw new Meteor.Error(412, "Cannot mark activity as done.  Invalid activity");

    StudentIDs.forEach(function(StudentID) {
      var student = Meteor.users.findOne(StudentID);
      if (!student)
        throw new Meteor.Error(425, "Cannot mark activity as done.  Invalid user.")

      if (!Roles.userIsInRole(student,'student')) 
        throw new Meteor.Error(426, "Cannot mark activity as done.  Not a student.")
    });

    StudentIDs.forEach(function(StudentID) {
      Meteor.users.update(StudentID,{$pull: {completedActivities:ActivityID}});
    });
  }
});  

if (Meteor.isServer) {
if (Activities.find().count() === 0) {
  Activities.insert({
    title : 'Acceleration Intro',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 0,
    visible: true
  });

  Activities.insert({
    title : 'Problem-solving with the Velocity Graph',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 1,
    visible: true
  }); 

  Activities.insert({
    title : 'Olympic Event - Designer Ramp',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 2,
    visible: true
  });

  Activities.insert({
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 3,
    visible: true
  });

  Activities.insert({
    title : 'Model Summary',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 4,
    visible: true
  });

  Activities.insert({
    title : 'Olympic Event - Hole in One',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : '',
    rank : 5,
    visible: true
  });

  Activities.insert({
    title : 'Broom Ball Review',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 0,
    visible: true
  });

  Activities.insert({
    title : 'Force Diagrams for Stationary Objects',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 1,
    visible: true
  });

  Activities.insert({
    title : 'Force Diagrams for Moving Objects',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 2,
    visible: true
  });

  Activities.insert({
    title : 'Weight vs. Mass Lab',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 3,
    visible: true
  });

  Activities.insert({
    title : 'Statics with Horizontal and Vertical Forces',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 4,
    visible: true
  });

  Activities.insert({
    title : 'Statics with Forces at Angles',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 5,
    visible: true
  });

  Activities.insert({
    title : 'Olympic Event - Stuffed Animals',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 6,
    visible: true
  });

  Activities.insert({
    title : 'Dueling Forces',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 7,
    visible: true
  });

  Activities.insert({
    title : 'Model Summary',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 8,
    visible: true
  });
};
};
