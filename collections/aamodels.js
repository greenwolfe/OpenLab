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
    rank: 0,
    visible: true
  }); */

Meteor.methods({

  /***** POST MODEL ****/
  postModel: function(Model,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var ModelId,maxRank,ranks;

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

    if (!Model.hasOwnProperty('visible'))
      Model.visible = true;
   
    ranks = Models.find().map(function(m) {return m.rank});
    if (ranks.length) {
      maxRank = _.max(ranks)
    } else {
      maxRank = -1;
    }
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

  /***** UPDATE MODEL ****/
  updateModel: function(nM) { //newModel
    var cU = Meteor.user(); //currentUser
    var Model = Models.findOne(nM._id);
    var r;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a model");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to update a model.')
  
    if (!Model)
      throw new Meteor.Error(412, "Cannot update model.  Invalid ID.");

    if (nM.model && (nM.Model != Model.model) && nM.model != '') 
      Models.update(nM._id,{$set: {model: nM.model}});

    if (nM.hasOwnProperty('description') && (nM.description != Model.description)) 
      Models.update(nM._id,{$set: {description: nM.description}});

    if (nM.hasOwnProperty('longname') && (nM.longname != Model.longname)) 
      Models.update(nM._id,{$set: {longname: nM.longname}});

    if (nM.hasOwnProperty('visible') && (nM.visible != Model.visible)) 
      Models.update(nM._id,{$set: {visible: nM.visible}});
    
    if (nM.hasOwnProperty('rank') && (nM.rank != Model.rank)) {
      Models.update(nM._id,{$set: {rank: nM.rank}});  
    };

    return Model._id;
  } 
});  

if (Meteor.isServer) {
if (Models.find().count() === 0) {
  Models.insert({
    model : 'CAPM',
    longname : 'Constant Acceleration Particle Model',
    description : '',
    rank: 0,
    visible: true
  });

  Models.insert({
    model : 'BFPM',
    longname : 'Balanced Force Particle Model',
    description : '',
    rank: 1,
    visible: true
  });
};
};