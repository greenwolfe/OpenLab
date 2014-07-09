CalendarEvents = new Meteor.Collection('calendarEvents');

CalendarEvents.allow({
  remove: function(userId,eventID) {
    //more conditions here?
    var cE = CalendarEvents.findOne(eventID);
    return (!!userId && !!cE && (cE.group.length == 0));
  },
  update: function(userId,eventID) {
    //allows accepting of invitations, but also allows any other modifications while the user is in the invite list and not part of the group.  Is there a straightforward way to remedy this?
    var cE = CalendarEvents.findOne(eventID);
    return (!! userId && !!cE && ( (_.contains(cE.group,userId)) || (_.contains(cE.invite,userId)) ));
  }
});


//from/client/group/invite_group.js
/*    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : inviteList, //array of selected users
      eventDate : InviteGroup.eventDate, //'ddd[,] MMM D YYYY'
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    }; */

Meteor.methods({

  /***** POST CALENDAR EVENT ****/
  postCalendarEvent: function(cE) { 
    var cU = Meteor.user(); //currentUser
    var eventId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to add an event to the calendar");

    if (!cE.creator || (cU._id != cE.creator))
      throw new Meteor.Error(402, "Only the currently logged in user can add an event to the calendar.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot create calendar event.  Improper group.");

    if (!cE.hasOwnProperty('invite') || !_.isArray(cE.invite))
      throw new Meteor.Error(403, "Cannot create calendar event.  Improper invitation list.");

    cE.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot create calendar event.  Group members must be valid users.");
    });

    cE.invite.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(405, "Cannot create calendar event.  All invitees must be valid users.");
    });

    if (!cE.hasOwnProperty('activityID') || !Activities.findOne(cE.activityID))
      throw new Meteor.Error(406, "Cannot create calendar event.  Invalid activity ID.");

    if (!cE.hasOwnProperty('workplace'))
      throw new Meteor.Error(407, "Cannot create calendar event.  Invalid workplace");

    if (!_.contains(['inClass','outClass','home'],cE.workplace))
      throw new Meteor.Error(407, 'Cannot create calendar event. "' + cE.workplace + '" is not a valid workplace');

    if (!cE.eventDate || !moment(cE.eventDate,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot create calendar event.  Invalid date");
    
    if (Roles.userIsInRole(cU,'teacher')) {
     eventID = CalendarEvents.insert(cE);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(cE.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot create calendar event unless you are part of the group.')
      eventID = CalendarEvents.insert(cE);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to create  a new calendar event.')
    };

    return eventID;
  },

  /***** ACCEPT INVITE ****/
  acceptInvite: function(eventID) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to accept an invitation.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot accept invite.  Invalid event ID.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot accept invitation.  Improper group.");

    if (!cE.hasOwnProperty('invite') || !_.isArray(cE.invite))
      throw new Meteor.Error(403, "Cannot accept invitation.  Improper invitation list.");
    
    if (_.contains(cE.group,cU._id) || !_.contains(cE.invite,cU._id))
      throw new Meteor.Error(413, "You must be in the invitation list, and not yet part of the group in order to accept an invitation.")

    CalendarEvents.update(eventID,{$addToSet: {group : cU._id} });
    CalendarEvents.update(eventID,{$pull: {invite : cU._id}});

    return eventID;
  },

  /***** DECLINE INVITE ****/
  declineInvite: function(eventID) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to decline an invitation.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot decline invite.  Invalid event ID.");

    if (!cE.hasOwnProperty('invite') || !_.isArray(cE.invite))
      throw new Meteor.Error(403, "Cannot decline invitation.  Improper invitation list.");
    
    if (!_.contains(cE.invite,cU._id))
      throw new Meteor.Error(413, "You can't decline a invitation unless you've first been invited.")

    CalendarEvents.update(eventID,{$pull: {invite : cU._id}});

    return eventID;
  },

  /**** CHANGE WORKPLACE ****/
  changeWorkplace: function(eventID,workplace) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to modify a calendar event.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot modify calendar event.  Invalid event ID.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot modify calendar event.  Improper group.");
    
    if (!_.contains(cE.group,cU._id) && !Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(408, 'Cannot modify calendar event unless you are part of the group.')

    if (!cE.hasOwnProperty('workplace'))
      throw new Meteor.Error(407, "Cannot modify calendar event.  Invalid workplace");

    if (!_.contains(['inClass','outClass','home'],workplace))
      throw new Meteor.Error(407, 'Cannot modify calendar event. "' + workplace + '" is not a valid workplace');

   CalendarEvents.update(eventID,{$set: {workplace: workplace}});

    return eventID;
  },

  /**** CHANGE DATE ****/
  changeDate: function(eventID,newDate) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to modify a calendar event.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot modify calendar event.  Invalid event ID.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot modify calendar event.  Improper group.");
    
    if (!_.contains(cE.group,cU._id) && !Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(408, 'Cannot modify calendar event unless you are part of the group.')

    if (!cE.eventDate || !moment(cE.eventDate,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot modify calendar event.  Invalid date");

    if (!moment(newDate,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot modify calendar event.  Invalid date");
  
   if (newDate != cE.eventDate)
     CalendarEvents.update(eventID,{$set: {eventDate : newDate} });

    return eventID;
  }
  /**** DELETE EVENT ****/ //calls remove from here, so can take allow off of remove, too (!!?)
});

//from /client/views/student/calendar.js
//CalendarEvents.update(eventID,{$pull: {group : Meteor.userId()}});
//CalendarEvents.remove(eventID);

