Template.inviteGroup.helpers({
  sections: function() {
    return Sections.find();
  },
  usersInSection : function () {
    //var iSID = Session.get("inviteSectionID");
    var IG = Session.get('InviteGroup');
    if (!IG) return '';
    if (!IG.sectionID) return '';
    var uIS = Meteor.users.find({_id: {$ne: Meteor.userId()},
      'profile.sectionID': IG.sectionID},{sort: {username: 1}}).fetch();
    var o,i,Ncol = 5;
    uIS.forEach(function(u,i) {
      u.startTableRow = (i%Ncol == 0) ? '<tr>' : '';
      u.closeTableRow = (i%Ncol == Ncol-1) ? '</tr>' : '';
      u.selected = _.contains(IG.group,u._id) ? 'selected' : '';
    });
    uIS[uIS.length - 1].closeTableRow = '</tr>';
    return uIS; 
  },
  groupToInvite : function() {
    var IG = Session.get('InviteGroup');
    if (IG && IG.group && IG.group.length)
      return IG.group;
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
      'roles': {$in: ['teacher']}}).count;
  },
  teachers: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()},
      'roles': {$in: ['teacher']}})
  }
});

Template.inviteGroup.events({
  'click button.btn-section' : function(event) {
    var IG = Session.get('InviteGroup');
    IG.sectionID = $(event.target).data('sectionid');
    Session.set('InviteGroup',IG);
  },
  'click button.btn-user' : function(event) {
    var IG = Session.get('InviteGroup');
    var userID = $(event.target).data('userid');
    var i = IG.group.indexOf(userID);
    (i === -1) ? IG.group.push(userID) : IG.group.splice(i,1);
    Session.set('InviteGroup',IG)
  },
  'click #JustMe': function (event) {
    var IG = Session.get('InviteGroup');
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : [],
      eventDate : IG.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : IG.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent, 
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    IG.sectionID = '';
    IG.group = [];
    Session.set('InviteGroup',IG)
    $('#inviteGroupDialog').modal('hide');
  },

  'click #Invite': function (event) {
    var IG = Session.get("InviteGroup");
    if (!IG.group.length) {
      alert("NOTICE:  Since you didn't select anyone,\n this will be treated as if you had clicked just me.")
    }
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : IG.group, 
      eventDate : IG.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : IG.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent,
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    IG.sectionID = '';
    IG.group = [];
    Session.set('InviteGroup',IG)
    $('#inviteGroupDialog').modal('hide');
  }

});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
