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
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove();
    $('#inviteGroupDialog').modal('hide');
  },

  'click #Invite': function (event) {
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : $('#userList').val(),
      date : $('#inviteGroupDialog').data('eventDate'),
      activityID : $('#inviteGroupDialog').data("activityid")
    };
    event.preventDefault();
    CalendarEvents.insert(calendarEvent);
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove();
    $('#inviteGroupDialog').modal('hide');
  }

});

//
