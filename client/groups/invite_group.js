Template.inviteGroup.helpers({
  sections: function() {
    var sections = Sections.find().fetch();
    var IG = Session.get('InviteGroup');
    if (!IG) return '';
    sections.forEach(function(s,i) {
      s.selected = (IG.hasOwnProperty('sectionID') && (s._id == IG.sectionID)) ? 'selected' : '';
    });
    return sections;
  },
  usersInSection : function () {
    var IG = Session.get('InviteGroup');
    var uIS; //users In Section
    if (!IG) return '';
    if (!IG.sectionID) return '';
    if (IG.sectionID == 'teachers') {
      uIS = Meteor.users.find({_id: {$ne: Meteor.userId()},
      'roles': {$in: ['teacher']}}).fetch();
    } else {
      uIS = Meteor.users.find({_id: {$ne: Meteor.userId()},
      'profile.sectionID': IG.sectionID},{sort: {username: 1}}).fetch();
    };
    if (!uIS.length) return '';
    var o,i,Ncol = 5;
    uIS.forEach(function(u,i) {
      u.selected = _.contains(IG.group,u._id) ? 'selected' : '';
    });
    return uIS; 
  },
  invite: function() {
    var IG = Session.get('InviteGroup');
    var currentUser = Meteor.user();
    if (Roles.userIsInRole(currentUser,'teacher') && 
      IG && IG.group && !IG.group.length && 
      IG.sectionID && (!!Sections.findOne(IG.sectionID) || (IG.sectionID == '_ALL_')))
      return 'Invite';
    if (!IG || !IG.group || !IG.group.length) return 'Just Me';
    return 'Invite'
  },
  groupToInvite : function() {
    var IG = Session.get('InviteGroup');
    var currentUser = Meteor.user();
    if (IG && IG.group && IG.group.length)
      return IG.group;
    if (Roles.userIsInRole(currentUser,'teacher') && 
      IG && IG.sectionID && IG.group && !IG.group.length)
      return [IG.sectionID];
    return '';
  },
  title: function() {
    var InviteGroup = Session.get("InviteGroup");
    if (!InviteGroup) return 'Invite Group';
    return Activities.findOne(InviteGroup.activityID).title;
  },
  date: function() {
    var InviteGroup = Session.get("InviteGroup");
    if (!InviteGroup) return '';
    return moment(InviteGroup.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D');
  },
  teacherCount: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()},
      'roles': {$in: ['teacher']}}).count();
  },
  teachers: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()},
      'roles': {$in: ['teacher']}})
  },
  teachersSelected: function() {
    var IG = Session.get('InviteGroup');
    if (!IG) return '';
    return (IG.sectionID && (IG.sectionID == 'teachers')) ? 'selected' : '';
  }
});

Template.inviteGroup.events({
  'click #Invite': function (event) {
    var currentUser = Meteor.user();
    var group = [currentUser._id];
    var invite = [];
    var IG = Session.get("InviteGroup");
    if (IG.hasOwnProperty('group') && _.isArray(IG.group)) 
      invite = IG.group;
    if (Roles.userIsInRole(currentUser,'teacher') && 
      IG.sectionID && Sections.findOne(IG.sectionID) && 
      !IG.group.length) {
      group = [IG.sectionID];
      invite = [];
    }
    var calendarEvent = {
      creator : currentUser._id,
      group : group,
      invite : invite, 
      eventDate : IG.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : IG.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent,
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    if (currentUser && currentUser.profile && currentUser.profile.sectionID) {
      IG.sectionID =   currentUser.profile.sectionID;   
    } else {
      IG.sectionID = Sections.findOne()._id;
    }; 
    IG.group = [];
    Session.set('InviteGroup',IG);
    $('#inviteGroupDialog').modal('hide');
  },
  'click i.remove' : function(event) {
    var currentUser = Meteor.user();
    var IG = Session.get("InviteGroup");
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    if (currentUser && currentUser.profile && currentUser.profile.sectionID) {
      IG.sectionID =   currentUser.profile.sectionID;   
    } else {
      IG.sectionID = Sections.findOne()._id;
    }; 
    IG.group = [];
    Session.set('InviteGroup',IG);
    $('#inviteGroupDialog').modal('hide');
  }
});

Template.sectionToInvite.events({
  'click div.IGsection' : function(event) {
    console.log(event.ctrlKey);
    var IG = Session.get('InviteGroup');
    var newID = $(event.target).data('sectionid');
    IG.sectionID = (IG.sectionID == newID) ? '' : newID;
    Session.set('InviteGroup',IG);
  }  
});

Template.userToInvite.events({
  'click div.IGuser' : function(event) {
    var IG = Session.get('InviteGroup');
    var userID = $(event.target).data('userid');
    var i = IG.group.indexOf(userID);
    (i === -1) ? IG.group.push(userID) : IG.group.splice(i,1);
    Session.set('InviteGroup',IG)
  }
});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
