Template.inviteGroup.rendered = function() {
  $('#inviteGroupDialog').dialog(DialogOpt());
  $('#userList').buttonset();
};

Template.inviteGroup.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  }
});

var DialogOpt = function() {
  var that = {
    autoOpen : false,
    modal : true,
    buttons: {
      Invite : function() {
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
      "Just me": function() {
        var calendarEvent = {
          creator : Meteor.userId(),
          group : [Meteor.userId()],
          invite : [],
          date : $(this).data('eventDate'),
          activityID : $(this).data("activityid")
        };
        CalendarEvents.insert(calendarEvent);
        $(this).data('caller').find('p:not([data-eventid])').remove();
        $( this ).dialog( "close" );
      }
    },
   close: function() {
    $(':checkbox').prop('checked',false);
    $('#userList').buttonset('refresh');
   }
  };
  return that;
};
