Template.joinGroup.helpers({
  recentGroupieEvents: function() {
    //filter out assessments or reassessments?
    var JG = Session.get("joinGroup");
    if (!JG) return '';
    var cU = Meteor.user();
    if (!cU || !('profile' in cU) || !('recentGroupies' in cU.profile))
      return '';
    return CalendarEvents.find({activityID:JG.activityID,eventDate:JG.eventDate,group: {$in: cU.profile.recentGroupies}});
  },
  title: function() {
    var JG = Session.get("joinGroup");
    if (!JG) return 'Join Group';
    return Activities.findOne(JG.activityID).title;
  },
  date: function() {
    var JG = Session.get("joinGroup");
    if (!JG) return '';
    return moment(JG.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D');
  },
  recentGroupies: function() {
    var cU = Meteor.user();
    if (!cU || !('profile' in cU) || !('recentGroupies' in cU.profile))
      return '';
    return cU.profile.recentGroupies;
  }
});

Template.joinGroup.events({
  'click .joinGroupButton' : function(event) {
    Meteor.call('joinGroup',$(event.target).data('id'))
    $('#joinGroupDialog').modal('hide');
    $('#joinGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
  },
  'click #joinGroupJustMe' : function(event) {
    var cU = Meteor.userId();
    var JG = Session.get("joinGroup");
    var calendarEvent = {
      creator : cU,
      group : [cU],
      invite : [], 
      eventDate : JG.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : JG.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent,
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#joinGroupDialog').modal('hide');
    $('#joinGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
  },
  'click i.remove' : function(event) {
    $('#joinGroupDialog').modal('hide');
    $('#joinGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
    //calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
  }
});