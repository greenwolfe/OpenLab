Sections = new Meteor.Collection('sections');

Sections.allow({
  insert: function(userId, doc) {
    return (!!userId && Roles.isUserInRole(userId,'teacher'));
  }
}); 

if (Meteor.isServer) {
if (Sections.find().count() === 0) {
  Sections.insert({
    section : 'Bblock',
  });

  Sections.insert({
    section : 'Fblock',
  });

  Sections.insert({
    section : 'Gblock',
  });

};
};
