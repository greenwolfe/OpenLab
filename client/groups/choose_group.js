Template.chooseGroup.rendered = function() {
  $('#chooseGroupDialog').dialog(DialogOpt());
};

var DialogOpt = function() {
  var that = {
    autoOpen : false,
    modal : true,
    buttons: {
      Invite : function() {
        email = $('#email').val(); //... how to retrieve data from form
        calendarEvent = {
          creator : Meteor.userId(),
          group : [Meteor.userId()],
          date : $(this).data('eventDate'),
          activityID : $(this).data("activityid")
        };
        CalendarEvents.insert(calendarEvent);
        $(this).data('caller').find('p:not([data-eventid])').remove(); //calendar_event.html adds data-eventid when placing event in calendar, the unwanted duplicate event placed by jquery-ui on end of sort does not have this field.
        $( this ).dialog( "close" );
      },
      "Just me": function() {
        console.log("Just Me");
        $( this ).dialog( "close" );
      }
    },
   close: function() {
    allFields.val( "" ).removeClass( "ui-state-error" );
   }
  };
  return that;
};
