
  /*****************************/
 /**** OPENINVITES SECTION ****/
/*****************************/

Template.openInvites.helpers({
  groups : function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites)       return ''; //handles error on initial rendering when session variable not set
    return CalendarEvents.find({activityID: OpenInvites.activityID, eventDate: OpenInvites.eventDate, invite: {$in: [Meteor.userId()]}});
  },
  title: function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites) return 'Open Invitations';
    return Activities.findOne(OpenInvites.activityID).title;
  },
  date: function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites) return '';
    return moment(OpenInvites.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D');
  }
});

Template.openInvites.events({
  'click button' : function(event) {
    var OpenInvites = Session.get("OpenInvites");
    var date = OpenInvites.eventDate;
    var activityID = OpenInvites.activityID
    var calendarEvents = CalendarEvents.find({activityID: activityID, eventDate: date, invite: {$in: [Meteor.userId()]}});
    if (event.target.id != 'Decline') {
      CalendarEvents.update(event.target.id,{$addToSet: {group : Meteor.userId()} });
    }
    calendarEvents.forEach(function(event) {
      CalendarEvents.update(event._id,{$pull: {invite : Meteor.userId()}});
    });
    $('#openInviteDialog').modal('hide');
    if (event.target.id == 'Decline') {
     Session.set("InviteGroup",{'eventDate': date,'activityID': activityID});
     $('#inviteGroupDialog').data('daysActivities',$('#openInviteDialog').data('daysActivities')).modal();
    } else {
      $('#openInviteDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
    }
  }
});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.

  /****************************/
 /**** OPENINVITE SECTION ****/
/****************************/

Template.openInvite.helpers({
  group : function() {
    return _.without( this.invite.concat(this.group), Meteor.userId() );
  }
});
