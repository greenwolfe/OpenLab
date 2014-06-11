//basic structure working when template does not call helper.  On decline, there was an incorrect delete of another event on the same day.

Template.openInvite.rendered = function() {
  $('#openInviteDialog').dialog(DialogOpt());
};

Template.openInvite.helpers({
  potentialGroup : function () {
     
  }
});

var DialogOpt = function() {
  var that = {
    autoOpen : false,
    modal : true,
    buttons: {
      Accept : function() {
        //add current user to group list, remove from invite list
        //sample code
        //CalendarEvents.update(eventID,{$set: {date : date} });
        var group = [Meteor.userId()];
        $('#userList').find('label.ui-state-active').each(function() {
          group.push($(this).attr('for'));
        });
        //email = $('#email').val(); //... how to retrieve data from form
        var calendarEvent = {
          creator : Meteor.userId(),
          group : [Meteor.userId()],
          invite : group,
          date : $(this).data('eventDate'),
          activityID : $(this).data("activityid")
        };
        CalendarEvents.insert(calendarEvent);
        $(this).data('caller').find('p:not([data-eventid])').remove(); //calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
        $( this ).dialog( "close" );
      },
      Decline : function() {
        //remove userid from invite
        var eventDate = $(this).data('eventDate');
        var activityID = $(this).data('activityID');
        var $dialog = $(this).data('caller');
        $('#inviteGroupDialog').data('eventDate',date).data('activityid',activityID).data('caller',$dialog).dialog("open"); 
        $( this ).dialog( "close" );
      }
    }
  };
  return that;
};
