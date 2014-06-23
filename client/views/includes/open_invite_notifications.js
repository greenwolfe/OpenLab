Template.OpenInviteNotifications.helpers({

  openInvites: function() {
    var calendarEvents = CalendarEvents.find({invite: {$in: [Meteor.userId()]}});
    var activityID, date;
    var freq = {};
    var openInvites = [];
    calendarEvents.forEach(function (event) {
      var activityID = event.activityID;
      var date = event.eventDate;
      if (freq.hasOwnProperty(activityID)) {
        freq[activityID][date] = freq[activityID][date] ? freq[activityID][date] + 1 : 1;
      } else {
        freq[activityID] = {};
        freq[activityID][date] = 1;
      };
    });
    for (activityID in freq) {
      for (date in freq[activityID]) {
        openInvites.push({
          date: moment(date,'ddd[,] MMM D YYYY').format('ddd[,] MMM D'),
          title: Activities.findOne(activityID).title,
          frequency: freq[activityID][date]
//put in global helper
//add model and from (group inviting the user)
//makeit a session variable, reactively updated whenever CalendarEvents is modified (or a client side only collection?)
//can it then sort and count it like a collection?
        });
      };
    };
    return openInvites;
  },

  openInvitesCount: function() {
    calendarEvents = CalendarEvents.find({invite: {$in: [Meteor.userId()]}});
    return CalendarEvents.find({invite: {$in: [Meteor.userId()]}}).count();
  }

});
