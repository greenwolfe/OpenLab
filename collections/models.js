Models = new Meteor.Collection('models');

Models.allow({
  remove: function(userId, doc) {
  // only allow adding activities if you are logged in
  // must alter this to only allow teacher to add activities
  return !! userId;
  }
}); 

if (Meteor.isServer) {
if (Models.find().count() === 0) {
  Models.insert({
    model : 'CAPM',
    longname : 'Constant Acceleration Particle Model',
    description : ''
  });

  Models.insert({
    model : 'BFPM',
    longname : 'Balanced Force Particle Model',
    description : ''
  });
};
};