Standards = new Meteor.Collection('standards');

  /* Standards.insert({
    title : 'Position Graphs',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : 'I can ... '
    rank : 0,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: '' //function(gradesArray) { return most recent or some type of average}
    LoM: 'M' //for a particular user ... calculated according to calcMethod ... added temporarily in publication, not in database
  }); */

Meteor.methods({
  /*removeAllStandards: function() {
    return Standards.remove({});
  },*/

  /***** POST STANDARD ****/
  postStandard: function(Standard,defaultText) { 
    var cU = Meteor.user(); //currentUser
    var StandardId,maxRank,ranks;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a standard");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to post a standard.')
    
    if (!Standard.title || (Standard.title == defaultText) || (Standard.title == ''))
      throw new Meteor.Error(413, "Cannot post standard.  Missing title.");

    if (!Standard.hasOwnProperty('modelID'))
      throw new Meteor.Error(402, "Cannot post standard.  Missing model.");
   
    if (Standard.modelID != 'wholecourse') {
      model = Models.findOne(Standard.modelID);
      if (!model)
         throw new Meteor.Error(421, "Cannot post standard.  Improper model.")
    };

    if (!Standard.hasOwnProperty('description'))
      Standard.description = '';

    if (!Standard.hasOwnProperty('scale'))
      Standard.scale = ['NM','DM','M'];
    if (!( (_.isArray(Standard.scale)) || 
      ((_.isFinite(Standard.scale)) && (Standard.scale > 0)) ))
      throw new Meteor.Error(471, "Cannot post standard. Scale must be an array of acronyms or a positive number.")

    if (!Standard.hasOwnProperty('calcMethod'))
      Standard.calcMethod = '';  //function(gradesArray) { return most recent or some type of average}

    if (!Standard.hasOwnProperty('visible'))
      Standard.visible = true;
    
    ranks = Standards.find({modelID: Standard.modelID}).map(function(a) {return a.rank});
    if (ranks.length) {
      maxRank = _.max(ranks)
    } else {
      maxRank = -1;
    }
    if (!Standard.hasOwnProperty('rank'))
      Standard.rank = maxRank + 1;

    StandardID = Standards.insert(Standard);

    return StandardID; 
  },  

  /***** DELETE STANDARD ****/
  deleteStandard: function(StandardID) { 
    var cU = Meteor.user(); //currentUser
    var Standard = Standards.findOne(StandardID);
    var LoMcount;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a standard");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to delete a standard.')
  
    if (!Standard)
      throw new Meteor.Error(412, "Cannot delete standard.  Invalid ID.");

    LoMcount = LevelsOfMastery.find({standardID:StandardID}).count();
    if (LoMcount)
      throw new Meteor.Error(469, "Levels of Mastery have already been assigned to this Standard.  Cannot delete.");

    Standards.remove(StandardID);
    
    return StandardID;
  }, 

  /***** UPDATE STANDARD ****/
  updateStandard: function(nS) { //newStandard
    var cU = Meteor.user(); //currentUser
    var Standard = Standards.findOne(nS._id);
    var maxRank,r,currentModelID;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a standard.");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to update a standard.')
  
    if (!Standard)
      throw new Meteor.Error(412, "Cannot update standard.  Invalid ID.");
    currentModelID = Standard.modelID;

    if (nS.title && (nS.title != Standard.title) && nS.title != '') 
      Standards.update(nS._id,{$set: {title: nS.title}});

    if (nS.hasOwnProperty('description') && (nS.description != Standard.description)) 
      Standards.update(nS._id,{$set: {description: nS.description}});

    if (nS.hasOwnProperty('visible') && (nS.visible != Standard.visible)) 
      Standards.update(nS._id,{$set: {visible: nS.visible}});
    
    if (nS.hasOwnProperty('modelID') && (nS.modelID != Standard.modelID)) {
      if (nS.modelID != 'wholecourse') {
        model = Models.findOne(nS.modelID);
        if (!model)
          throw new Meteor.Error(421, "Cannot update standard.  Improper model.")
      };
      maxRank = _.max(Standards.find({modelID: nS.modelID}).map(function(a) {return a.rank}))
      Standards.update(nS._id,{$set: {modelID: nS.modelID,rank: maxRank+1}});
      Standard.modelID = nS.modelID;  //??? what is this doing?
    };

    if (nS.hasOwnProperty('scale'))
      if (!( (_.isArray(Standard.scale)) || 
      ((_.isFinite(Standard.scale)) && (Standard.scale > 0)) ))
        throw new Meteor.Error(471, "Cannot update standard. Scale must be an array of acronyms or a positive number.");
      Standards.update(nS._id,{$set: {scale:nS.scale}});

    if (nS.hasOwnProperty('rank') && (nS.rank != Standard.rank)) {
      Standards.update(nS._id,{$set: {rank: nS.rank}}); 
    };

    return Standard._id;
  } 
});  

if (Meteor.isServer) {
if (Standards.find().count() === 0) {
  Standards.insert({
    title : 'Position Graphs',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : 'I can draw ... and calculate ... ',
    rank : 0,
    visible: true,
    scale: [],
    calcMethod: ''
  });

  Standards.insert({
    title : 'Velocity Graphs',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : 'I can draw ... and calculate ... ',
    rank : 1,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  }); 

  Standards.insert({
    title : 'Acceleration Graphs',
    modelID : Models.findOne({model:'CAPM'})._id,
    description : 'I can draw ... and calculate ...',
    rank : 2,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  });

  Standards.insert({
    title : "Newton's First Law",
    modelID : Models.findOne({model:'BFPM'})._id,
    description : 'I can draw ... and calculate ...',
    rank : 0,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  });

  Standards.insert({
    title : 'Weight vs. Mass',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : 'I can define ... and explain ... and calculate ...',
    rank : 1,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  });

  Standards.insert({
    title : 'Force Diagrams for Moving Objects',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : '',
    rank : 2,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  });

  Standards.insert({
    title : 'Vector Addition 2 (Force)',
    modelID : Models.findOne({model:'BFPM'})._id,
    description : 'I can draw ...',
    rank : 3,
    visible: true,
    scale: ['NM','DM','M'],
    calcMethod: ''
  });

};
};