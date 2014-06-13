Template.inviteGroup.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  }
});

Template.inviteGroup.events({

  'click #JustMe': function (event) {
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : [],
      date : $('#inviteGroupDialog').data('eventDate'),
      activityID : $('#inviteGroupDialog').data("activityid")
    };
    event.preventDefault();
    CalendarEvents.insert(calendarEvent);
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    $('#userList').val('');
  },

  'click #Invite': function (event) {
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : $('#userList').val(), //array of selected users
      date : $('#inviteGroupDialog').data('eventDate'),
      activityID : $('#inviteGroupDialog').data("activityid")
    };
    event.preventDefault();
    CalendarEvents.insert(calendarEvent);
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    $('#userList').val('');
  }

});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
