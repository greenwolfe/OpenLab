//basic structure working when template does not call helper.  On decline, it seems like the event placed by jquery is deleted as it should be, but the new event is not placed.  The right information must not have been passed through.

Template.openInvite.rendered = function() {
  $('#openInviteDialog').dialog(DialogOpt());
};


var DialogOpt = function() {
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
};
