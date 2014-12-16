CalendarEvents = new Meteor.Collection('calendarEvents');

//from/client/group/invite_group.js
/*    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : inviteList, //array of selected users
      eventDate : InviteGroup.eventDate, //'ddd[,] MMM D YYYY'
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    }; */
var frozen = function(date,ID) {
  var userToShow = Meteor.users.findOne(ID);
  var section = (userToShow && ('profile' in userToShow) && ('sectionID' in userToShow.profile))
   ? Sections.findOne(userToShow.profile.sectionID) : Sections.findOne(ID);
  var site = Site.findOne();
  var day;
  if (userToShow && ('frozen' in userToShow)) {
    day = _.find(userToShow.frozen,function(f) {return (f.date == date)});
    if (day) return day.frozen;
  }
  if (section && 'frozen' in section) {
    day = _.find(section.frozen,function(f) {return (f.date == date)});
    if (day) return day.frozen;
  }
  if (!('frozen' in site)) return false;   
  return (_.contains(site.frozen,date));
}

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

    cE.group.forEach(function(ID) {
      if (!Meteor.users.findOne(ID) && !Sections.findOne(ID) && !(ID == '_ALL_'))
        throw new Meteor.Error(404, "Cannot create calendar event.  Group members must be valid users.");
    });

    cE.invite.forEach(function(ID) {
      if (!Meteor.users.findOne(ID) && !Sections.findOne(ID) && !(ID == '_ALL_'))
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
    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");
    
    if (Roles.userIsInRole(cU,'teacher')) {
     eventID = CalendarEvents.insert(cE);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(cE.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot create calendar event unless you are part of the group.')
      eventID = CalendarEvents.insert(cE);
      Meteor.call('updateRecentGroupies',cE.group);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to create  a new calendar event.')
    };

    return eventID;
  },

 /***** JOIN GROUP ****/
  joinGroup: function(eventID) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to join a group.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot join group.  Invalid event ID.");

    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot join group.  Improper group.");

    if (_.contains(cE.group,cU._id))
      throw new Meteor.Error(413, "You are already part of this group. No need to join.")

    if (!Roles.userIsInRole(cU,['teacher','student']))
      throw new Meteor.Error(409, 'You must be student or teacher to join a group.') 

    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

    CalendarEvents.update(eventID,{$addToSet: {group : cU._id} });
    Meteor.call('updateRecentGroupies',_.union(cE.group,cU._id));

    return eventID;
  },

  /***** UPDATE INVITE LIST ****/
  updateInviteList: function(eventID,invite) { 
    var cU = Meteor.user(); //currentUser
    var cE = CalendarEvents.findOne(eventID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to update a calendare event");

    if (!_.isArray(invite))
      throw new Meteor.Error(403, "Cannot update calendar event.  Improper invitation list.");
    invite.forEach(function(ID) {
      if (!Meteor.users.findOne(ID) && !Sections.findOne(ID) && !(ID == '_ALL_'))
        throw new Meteor.Error(405, "Cannot update calendar event.  All invitees must be valid users.");
    });

    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

    if (Roles.userIsInRole(cU,'teacher')) {
     CalendarEvents.update(eventID,{$set: {invite: invite}});
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(cE.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot update calendar event unless you are part of the group.')
      CalendarEvents.update(eventID,{$set: {invite: invite}});
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

    if (!Roles.userIsInRole(cU,['teacher','student']))
      throw new Meteor.Error(409, 'You must be student or teacher to invite others to collaborate.') 

    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

    CalendarEvents.update(eventID,{$addToSet: {group : cU._id} });
    CalendarEvents.update(eventID,{$pull: {invite : cU._id}});
    Meteor.call('updateRecentGroupies',_.union(cE.group,cU._id));

    return eventID;
  },

  /***** DECLINE INVITE ****/
  declineInvite: function(eventID,userID) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to decline an invitation.");

    if (Roles.userIsInRole(cU,'teacher') && userID) {
      cU = Meteor.users.findOne(userID);
      if (!cU)
        throw new Meteor.Error(401, "Passed invalid userID to decline event.");
    }

    if (!cE)
      throw new Meteor.Error(412, "Cannot decline invite.  Invalid event ID.");

    if (!cE.hasOwnProperty('invite') || !_.isArray(cE.invite))
      throw new Meteor.Error(403, "Cannot decline invitation.  Improper invitation list.");
    
    if (!_.contains(cE.invite,cU._id))
      throw new Meteor.Error(413, "You can't decline a invitation unless you've first been invited.")

   if (!Roles.userIsInRole(cU,['teacher','student']))
      throw new Meteor.Error(409, 'You must be student or teacher to decline an invitation.') 

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

    if (!Roles.userIsInRole(cU,['teacher','student']))
      throw new Meteor.Error(409, 'You must be student or teacher to modify a calendar event.') 

    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

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
  
    if (!Roles.userIsInRole(cU,['teacher','student']))
      throw new Meteor.Error(409, 'You must be student or teacher to modify a calendar event.')  

    var oldDate = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    var newDateShortFormat = moment(newDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && 
       (frozen(oldDate,cU._id) || frozen(newDateShortFormat,cU._id)))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

    if (newDate != cE.eventDate)
     CalendarEvents.update(eventID,{$set: {eventDate : newDate} });
 
    return eventID;
  },

  /**** DELETE EVENT ****/
  deleteEvent: function(eventID,userID) {
    var cE = CalendarEvents.findOne(eventID); //calendarEvent
    var cU = Meteor.user(); //currentUser
    var sections = Sections.find().map(function(s) { return s._id });
    var groupOnlySections = true; // probably no longer needed

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to modify a calendar event.");

    if (!cE)
      throw new Meteor.Error(412, "Cannot modify calendar event.  Invalid event ID.");
  
    if (!cE.hasOwnProperty('group') || !_.isArray(cE.group))
      throw new Meteor.Error(402, "Cannot modify calendar event.  Improper group.");

    cE.group.forEach(function(id) { //probably no longer needed.
      groupOnlySections = (groupOnlySections && _.contains(sections,id));
    }) 

    var date = moment(cE.eventDate,'ddd[,] MMM D YYYY').format('MMM[_]D[_]YYYY');
    if (Roles.userIsInRole(cU,'student') && frozen(date,cU._id))
      throw new Meteor.Error(432, "This date is frozen.  Students must consult their teacher to change their schedule once dates are frozen.");

    if (Roles.userIsInRole(cU,'teacher') && _.contains(sections,userID)) {
      var usersInSection = Meteor.users.find({"profile.sectionID":userID}).map(function(u){
        return u._id;
      });
      usersInSection.push(userID);
      CalendarEvents.update(eventID,{$pullAll: {group: usersInSection}}); 
    //this next section probably does nothing now
    } else if (Roles.userIsInRole(cU,'teacher') && groupOnlySections) {
      CalendarEvents.update(eventID,{$set: {group: []}});
    } else if (Roles.userIsInRole(cU,'teacher') && !!userID) {
      var userToRemove = Meteor.users.findOne(userID);
      if (!userToRemove)
        throw new Meteor.Error(405,'Cannot delete event.  Invalid user.');
       if (!_.contains(cE.group,userToRemove._id)) 
          throw new Meteor.Error(408, 'Cannot delete event.  User not in group.');
      CalendarEvents.update(eventID,{$pull: {group : userToRemove._id}}); 
    } else if (Roles.userIsInRole(cU,['student','teacher'])) {
      if (!_.contains(cE.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot modify calendar event unless you are part of the group.');
      CalendarEvents.update(eventID,{$pull: {group : cU._id}});
    } else {
      throw new Meteor.Error(409, 'You must be a student or a teacher to modify a calendar event.') 
    }; 

    cE = CalendarEvents.findOne(eventID);
    if (cE.group.length == 0) {
      CalendarEvents.remove(eventID);
      return null;
    } else {
      return eventID;
    };
  }

});

