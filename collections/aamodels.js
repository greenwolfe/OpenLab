//file called aamodels so it will load before activities (and standards)
//is there a better way to handle this?
Models = new Meteor.Collection('models');

Models.allow({
  remove: function(userId, doc) {
  // only allow adding activities if you are logged in
  // must alter this to only allow teacher to add activities
  return !! userId;
  }
}); 

 /* Models.insert({
    model : 'CAPM',
    longname : 'Constant Acceleration Particle Model',
    description : '',
    rank: 0
  }); */

Meteor.methods({

  /***** POST MODEL ****/
  postModel: function(Model,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var ModelId,maxRank;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to add a model");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to add a model.')
    
    if (!Model.model || (Model.model == defaultText) || (Model.model == ''))
      throw new Meteor.Error(413, "Cannot add model.  Missing name.");

    if (!Model.hasOwnProperty('longname'))
      Model.longname = '';

    if (!Model.hasOwnProperty('description'))
      Model.description = '';
   
    maxRank = _.max(Models.find().map(function(m) {return m.rank}))
    if (!Model.hasOwnProperty('rank'))
      Model.rank = maxRank + 1;

    ModelID = Models.insert(Model);

    return ModelID; 
  },  

  /***** DELETE MODEL ****/
  deleteModel: function(ModelID) { 
    var cU = Meteor.user(); //currentUser
    var Model = Models.findOne(ModelID);
    var ActivitiesCount;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a model");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to delete a model.')
  
    if (!Model)
      throw new Meteor.Error(412, "Cannot delete model.  Invalid ID.");

    ActivitiesCount = Activities.find({modelID: ModelID}).count();
    if (ActivitiesCount) 
      throw new Meteor.Error(412, "Cannot delete model until you delete or move all of its activities.");
    //must do the same for standards

    Models.remove(ModelID);
    
    return ModelID;
  }, 

  /***** UPDATE ACTIVITY ****/
  updateModel: function(nA) { //newActivity
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
if (Models.find().count() === 0) {
  Models.insert({
    model : 'CAPM',
    longname : 'Constant Acceleration Particle Model',
    description : '',
    rank: 0
  });

  Models.insert({
    model : 'BFPM',
    longname : 'Balanced Force Particle Model',
    description : '',
    rank: 1
  });
};
};