Template.joinGroup.helpers({
  recentGroupieEvents: function() {
    //filter out assessments or reassessments?
    //default to section and then all users but keep 5 max
    //add message to choose a group
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
  },
  sections: function() {
    var sections = Sections.find({},{sort: [["section","asc"]]}).fetch();
    var JG = Session.get("joinGroup");
    if (!JG || !('sectionIDs' in JG)) return sections;
    sections.forEach(function(s,i) {
      s.selected = (_.contains(JG.sectionIDs,s._id)) ? 'ui-state-highlight' : '';
    });
    return sections;
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
  'click #joinGroupEditList' : function(event) {
    $('#joinGroupDialog').modal('hide');
    $('#changeGroupiesDialog').modal();
  },
  'click i.remove' : function(event) {
    $('#joinGroupDialog').modal('hide');
    $('#joinGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
    //calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
  },
  'click .addSection' : function(event) {
    var sectionID = $(event.target).data('id');
    var JG = Session.get("joinGroup");
    if (!JG) return;
    if (!('sectionIDs' in JG)) {
      JG.sectionIDs = [sectionID];
    } else {
      if (_.contains(JG.sectionIDs,sectionID)) {
        JG.sectionIDs = _.without(JG.sectionIDs,sectionID);
      } else {
        JG.sectionIDs.push(sectionID);
      };
    };
    Session.set("joinGroup",JG);
  },
  'click #joinGroupInviteSections' : function(event) {
    var JG = Session.get("joinGroup");
    if (!JG || !('sectionIDs' in JG) || (JG.sectionIDs.length == 0)) 
      return;
    var cU = Meteor.user();
    if (!Roles.userIsInRole(cU,'teacher')) return;
    var calendarEvent = {
      creator : cU._id,
      group : JG.sectionIDs,
      invite : [], 
      eventDate : JG.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : JG.activityID,
      workplace : 'inClass'
    };
    Meteor.call('postCalendarEvent', calendarEvent,
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#joinGroupDialog').modal('hide');
    $('#joinGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); // see below
  }
});