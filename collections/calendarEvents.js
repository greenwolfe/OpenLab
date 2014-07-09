CalendarEvents = new Meteor.Collection('calendarEvents');

CalendarEvents.allow({
  /*insert: function(userId, doc) {
    // only allow adding an event to the calendar if you are logged in and are in the group list of the link
    return (!! userId && (doc.group.indexOf(userId) + 1));
  },*/
  remove: function(userId,eventID) {
    var cE = CalendarEvents.findOne(eventID);
    return (!! userId && !!cE && (cE.group.length == 0));
  },
  update: function(userId,eventID) {
    //allows accepting of invitations, but also allows any other modifications while the user is in the invite list and not part of the group.  Is there a straightforward way to remedy this?
    var cE = CalendarEvents.findOne(eventID);
    return (!! userId && !!cE && ( (_.contains(cE.group,userId)) || (_.contains(cE.invite,userId)) ));
  }
});

Meteor.methods({
  postCalendarEvent: function(cE) { 
    var cU = Meteor.user(); //currentUser
    var eventId;

    if (!cU)  
      throw new Meteor.Error(401, "You need to login to add an event to the calendar");

    if (!cE.creator || (cU._id != cE.creator))
      throw new Meteor.Error(402, "Only the currently logged in user can add an event to the calendar.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot create event.  Improper group.");

    if (!cE.hasOwnProperty('invite') || !_.isArray(cE.invite))
      throw new Meteor.Error(403, "Cannot create event.  Improper invitation list.");

    cE.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Group members must be valid users.");
    });

    cE.invite.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(405, "You can only invite valid users.");
    });

    if (!cE.hasOwnProperty('activityID') || !Activities.findOne(cE.activityID))
      throw new Meteor.Error(406, "Invalid activity ID.");

    if (!cE.hasOwnProperty('workplace'))
      throw new Meteor.Error(407, "Invalid workplace");

    if (!_.contains(['inClass','outClass','home'],cE.workplace))
      throw new Meteor.Error(407, cE.workplace + " is not a valid workplace");
    
    if (Roles.userIsInRole(cU,'teacher')) {
     eventID = CalendarEvents.insert(cE);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(cE.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot create event unless you are part of the group.')
      eventID = CalendarEvents.insert(cE);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to create  a new calendar event.')
    };

    return eventID;
  }
});

//from /client/views/student/calendar.js
//CalendarEvents.update(eventID,{$set: {eventDate : date} });
//CalendarEvents.update(eventID,{$pull: {group : Meteor.userId()}});
//CalendarEvents.remove(eventID);

//from/client/group/invite_group.js
/*    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : [],
      eventDate : InviteGroup.eventDate,
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    };
    CalendarEvents.insert(calendarEvent);

    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : inviteList, //array of selected users
      eventDate : InviteGroup.eventDate,
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    };
    CalendarEvents.insert(calendarEvent); */

//from /client/group/open_invites.js
/*       CalendarEvents.update(event.target.id,{$addToSet: {group : Meteor.userId()} });

      CalendarEvents.update(event._id,{$pull: {invite : Meteor.userId()}});
    }); */

