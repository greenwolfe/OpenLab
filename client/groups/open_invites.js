Template.openInvites.helpers({
  groups : function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites) { //handles error on initial rendering when session variable not set
      return '';
    } else {
      return CalendarEvents.find({activityID: OpenInvites.activityID, eventDate: OpenInvites.eventDate, invite: {$in: [Meteor.userId()]}});
    };
  },
  title: function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites) {
      return 'Open Invitations';
    } else {
      return Activities.findOne(OpenInvites.activityID).title;
    };
  },
  date: function() {
    var OpenInvites = Session.get("OpenInvites");
    if (!OpenInvites) {
      return '';
    } else {
      return moment(OpenInvites.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D');
    };
  }
});

Template.openInvites.events({
  'click button' : function(event) {
    var OpenInvites = Session.get("OpenInvites");
    var calendarEvents = CalendarEvents.find({activityID: OpenInvites.activityID, eventDate: OpenInvites.eventDate, invite: {$in: [Meteor.userId()]}});
    if (event.target.id != 'Decline') {
      CalendarEvents.update(event.target.id,{$addToSet: {group : Meteor.userId()} });
    }
    $('#openInviteDialog').data('daysActivities').find('p:not([data-eventid])').remove();
    calendarEvents.forEach(function(event) {
      CalendarEvents.update(event._id,{$pull: {invite : Meteor.userId()}});
    });
    calendarEvents = CalendarEvents.find({activityID: OpenInvites.activityID, eventDate: OpenInvites.eventDate, invite: {$in: [Meteor.userId()]}});
    $('#openInviteDialog').modal('hide');
    //if event.target.id == 'Decline' then call invite_group template with context *********
     Session.set("InviteGroup",{'eventDate': date,'activityID': activityID});
      $('#inviteGroupDialog').data('daysActivities',$(this)).modal();
  }
});

//to-do ... clean up what happens when a user deletes a group event from his calendar ... 


/* var DialogOpt = function() {
  var that = {
    autoOpen : false,
    modal : true,
    open : function(event, ui) {
      var date = $(this).data('eventDate');
      var activityID = $(this).data("activityid");
      var OpenInvites = CalendarEvents.find({activityID: activityID, date: date, invite: {$in: [Meteor.userId()]}});
      var i,userID,inviteText,username;
      OpenInvites.forEach(function(OpenInvite) {
        inviteText = "<p>You have an open invitation to work with ";
        console.log(inviteText);
        for (i = 0; i < OpenInvite.invite.length; i++) {
          userID = OpenInvite.invite[i];
          inviteText += Meteor.users.findOne(userID).username + ', ';
          console.log(inviteText);
        }; 
        inviteText += '.</p>';
        console.log(inviteText);
        $(this).find('#openInviteDialog').append(inviteText);// not getting into template ... already rendered and doesn't render again?  have to prepare template, then insert it into UI.body?
      });
    },
    buttons: {
      Accept : function() {
        //add current user to group list, remove from invite list
        //sample code
        //CalendarEvents.update(eventID,{$set: {date : date} });



        $(this).data('caller').find('p:not([data-eventid])').remove(); 
        $( this ).dialog( "close" );
      },
      Decline : function() {
        //remove userid from invite
        var date = $(this).data('eventDate');
        var activityID = $(this).data('activityid');
        var caller = $(this).data('caller');
        $('#inviteGroupDialog').data('eventDate',date).data('activityid',activityID).data('caller',$(caller)).dialog("open"); 
        $( this ).dialog( "close" );
      }
    }
  };
  return that;
}; */
