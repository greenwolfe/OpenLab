CalendarEvents = new Meteor.Collection('calendarEvents');

CalendarEvents.allow({
  insert: function(userId, doc) {
    // only allow adding an event to the calendar if you are logged in and are in the group list of the link
    return (!! userId && (doc.group.indexOf(userId) + 1));
  },
  remove: function(userId,doc) {
    return (!! userId && (doc.group.indexOf(userId) + 1));
  },
  update: function(userId,doc) {
    //allows accepting of invitations, but also allows any other modifications while the user is in the invite list and not part of the group.  Is there a straightforward way to remedy this?
    return (!! userId && ((doc.group.indexOf(userId) + 1) || (doc.invite.indexOf(userId) + 1)));
  }
});


