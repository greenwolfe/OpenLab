Sections = new Meteor.Collection('sections');

Sections.allow({
  insert: function(userId, doc) {
    return (!!userId && Roles.userIsInRole(userId,'teacher'));
  },
  update: function(userId,doc) {
    return(!!userId && Roles.userIsInRole(userId,'teacher'));
  },
  remove: function(userId,doc) {
    return(!!userId && Roles.userIsInRole(userId,'teacher'))
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
if (Sections.find().count() === 3) {
  Sections.insert({
    section : 'Eblock',
  });
};

};
