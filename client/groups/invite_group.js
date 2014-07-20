Template.inviteGroup.helpers({
  sections: function() {
    return Sections.find();
  },
  usersInSection : function () {
    var iSID = Session.get("inviteSectionID");
    if (!iSID) return '';
    var uIS = Meteor.users.find({_id: {$ne: Meteor.userId()},
      'profile.sectionID': iSID},{sort: {username: 1}}).fetch();
    var o,i,Ncol = 5;
    uIS.forEach(function(o,i) {
      o.startTableRow = (i%Ncol == 0) ? '<tr>' : '';
      o.closeTableRow = (i%Ncol == Ncol-1) ? '</tr>' : '';
    });
    uIS[uIS.length - 1].closeTableRow = '</tr>';
    return uIS; 
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
  }
});

Template.inviteGroup.events({
  'click button.btn-section' : function(event) {
    Session.set('inviteSectionID',$(event.target).data('value'));
  },
  'click button.btn-user' : function(event) {
    console.log('clicked user button')
    console.log($(event.target).data('value') + ' ' + $(event.target).html());
    $(event.target).toggleClass('selected'); //set 
  },
  'click #JustMe': function (event) {
    var InviteGroup = Session.get("InviteGroup");
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : [],
      eventDate : InviteGroup.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent, 
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    //$('#userList').val(''); //reset any selections
    //have to figure out how to set selections before coming back to reset them
  },

  'click #Invite': function (event) {
    var InviteGroup = Session.get("InviteGroup");
    var inviteList = $('#userList').val();
    if (!inviteList) {
      alert("NOTICE:  Since you didn't select anyone,\n this will be treated as if you had clicked just me.")
    }
    var calendarEvent = {
      creator : Meteor.userId(),
      group : [Meteor.userId()],
      invite : inviteList, //array of selected users
      eventDate : InviteGroup.eventDate,  //'ddd[,] MMM D YYYY'
      activityID : InviteGroup.activityID,
      workplace : 'inClass'
    };
    event.preventDefault();
    Meteor.call('postCalendarEvent', calendarEvent,
      function(error, id) {if (error) return alert(error.reason);}
    );
    $('#inviteGroupDialog').data('daysActivities').find('p:not([data-eventid])').remove(); //see below
    $('#inviteGroupDialog').modal('hide');
    $('#userList').val('');
  }

});

Template.sectionToInvite.helpers({

});

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place.
