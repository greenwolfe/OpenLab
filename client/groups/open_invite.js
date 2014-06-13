Template.openInvite.helpers({
  groupies : function() {
    var group = _.without( this.invite.concat(this.group), Meteor.userId() );
    var groupies = "";
    var i;
    if (group.length == 1) {
      return Meteor.users.findOne(group[0]).username + ' has';
    } else {
      for (i = 0; i < group.length; i++) {
        userID = group[i];
        groupies += Meteor.users.findOne(userID).username;
        if (i == group.length - 2) {
          groupies += ' and ';
        } else if (i < group.length - 2) {
          groupies += ', ';
        };
      }; 
      return groupies + ' have';
    }
 
  }
});

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
