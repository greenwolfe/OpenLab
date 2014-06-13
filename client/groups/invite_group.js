Template.inviteGroup.helpers({
  users : function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}); 
  },
  title: function() {
    var InviteGroup = Session.get("InviteGroup");
    if (!InviteGroup) {
      return 'Invite Group';
    } else {
      return Activities.findOne(InviteGroup.activityID).title;
    };
  },
  date: function() {
    var InviteGroup = Session.get("InviteGroup");
    if (!InviteGroup) {
      return '';
    } else {
      return moment(InviteGroup.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D');
    };
  }
});

Template.inviteGroup.events({

  'click #JustMe': function (event) {
    var InviteGroup = Session.get("InviteGroup");
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : [],
      eventDate : InviteGroup.eventDate,
      activityID : InviteGroup.activityID
    };
    event.preventDefault();
    CalendarEvents.insert(calendarEvent);
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    $('#userList').val('');
  },

  'click #Invite': function (event) {
    var InviteGroup = Session.get("InviteGroup");
    var inviteList = $('#userList').val()
    if (!inviteList) {
      alert("Just letting you know that you didn't select anyone,\nso this will be treated as if you had clicked just me.")
    }
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : inviteList, //array of selected users
      eventDate : InviteGroup.eventDate,
      activityID : InviteGroup.activityID
    };
    event.preventDefault();
    CalendarEvents.insert(calendarEvent);
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    $('#userList').val('');
  }

});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
