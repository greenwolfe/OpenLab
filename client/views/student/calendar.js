  /*************************/
 /***** CALENDAR  *********/
/*************************/

Template.calendar.helpers({
  calendarWeeks: function() {
    var startDate = Session.get('calStartDate');
    var endDate = Session.get('calEndDate');
    var calendarWeeks = []; 
    startDate = moment(startDate,'ddd[,] MMM D YYYY'); 
    endDate = moment(endDate,'ddd[,] MMM D YYYY').add('days',1); 
    for (date=startDate; startDate.isBefore(endDate); date.add('weeks',1)) {
      calendarWeeks.push({monOfWeek : date.format('ddd[,] MMM D YYYY')});
    };
    return calendarWeeks;
  },
  hideinClass: function() {
    var visibleWorkplaces = Session.get('visibleWorkplaces');
    return _.contains(visibleWorkplaces,'inClass') ? '' : 'hideFromTeacher';
  },
  hideoutClass: function() {
    var visibleWorkplaces = Session.get('visibleWorkplaces');
    return _.contains(visibleWorkplaces,'outClass') ? '' : 'hideFromTeacher';    
  },
  hidehome: function() {
    var visibleWorkplaces = Session.get('visibleWorkplaces');
    return _.contains(visibleWorkplaces,'home') ? '' : 'hideFromTeacher';    
  },
  virtualWorkStatus: function() {
    var validStata = ['icon-virtual-work','icon-raise-virtual-hand','icon-virtual-help'];
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    var student = Meteor.users.findOne(cU);
    if (!student || !Roles.userIsInRole(student,'student'))
      return 'icon-virtual-work'
    if ( ('profile' in student) && ('virtualWorkStatus' in student.profile) &&
        _.contains(validStata,student.profile.virtualWorkStatus) ) {
        return student.profile.virtualWorkStatus;
    } else {
      Meteor.call('toggleVirtualWorkStatus',student._id,function(error, id) {
        if (error) return alert(error.reason);
      });
      return 'icon-virtual-work';    
    }
  }
});

Template.calendar.rendered = function(){
  var MonThisWeek = moment().day("Monday").format('ddd[,] MMM D YYYY');
  var MonNextWeek = moment().day("Monday").add('weeks',1).format('ddd[,] MMM D YYYY');
  Session.setDefault('calStartDate',MonThisWeek);
  Session.setDefault('calEndDate',MonNextWeek);
  var startDate = Session.get('calStartDate');
  var endDate = moment(Session.get('calEndDate'),'ddd[,] MMM D YYYY').day("Friday").format('ddd[,] MMM D YYYY');

  $('#startDate').datepicker(DateOpt('calStartDate')).datepicker('setDate', startDate);
  $('#endDate').datepicker(DateOpt('calEndDate')).datepicker('setDate', endDate);
  if (Meteor.userId()) {
    $('#inClassSwatch, #outClassSwatch, #homeSwatch').draggable(DragOpt('.daysActivities') );
  }
};

Template.calendar.events({
  'click i.icon-virtual-work, click i.icon-raise-virtual-hand, click i.icon-virtual-help': function(event) {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher'))
      cU = Session.get('TeacherViewAs');
    var student = Meteor.users.findOne(cU);
    Meteor.call('toggleVirtualWorkStatus',student._id,function(error, id) {
      if (error) return alert(error.reason);
    });
  },
  'click #inClassSwatch' : function(event) {
    var currentUser = Meteor.user();
    if (currentUser && Roles.userIsInRole(currentUser,'teacher')) {
      var vWp = Session.get('visibleWorkplaces');
      var i = vWp.indexOf('inClass');
      (i === -1) ? vWp.push('inClass') : vWp.splice(i,1);
      Session.set('visibleWorkplaces',vWp)
    }
  },
  'click #outClassSwatch' : function(event) {
    var currentUser = Meteor.user();
    if (currentUser && Roles.userIsInRole(currentUser,'teacher')) {
      var vWp = Session.get('visibleWorkplaces');
      var i = vWp.indexOf('outClass');
      (i === -1) ? vWp.push('outClass') : vWp.splice(i,1);
      Session.set('visibleWorkplaces',vWp)
    }
  },
  'click #homeSwatch' : function(event) {
    var currentUser = Meteor.user();
    if (currentUser && Roles.userIsInRole(currentUser,'teacher')) {
      var vWp = Session.get('visibleWorkplaces');
      var i = vWp.indexOf('home');
      (i === -1) ? vWp.push('home') : vWp.splice(i,1);
      Session.set('visibleWorkplaces',vWp)
    }
  }
});






var DateOpt = function(sessionKey) { //default datepicker options
  var onSelect = function(dateText,Object){
    Monday = moment(dateText,'ddd[,] MMM D YYYY').day("Monday");
    Monday = Monday.format('ddd[,] MMM D YYYY');
    Session.set(sessionKey,Monday); //Meteor takes care of not invalidating templates and causing re-rendering if the key is set to an identical value, and therefore not changed
  };
  var onClose = function(dateText,Object) {
    console.log(dateText);
  }
  var that = {
    dateFormat:'D, M dd yy',
    onSelect: onSelect,
    onClose: onClose
  };
  return that;
};

var DragOpt = function (sortable) { //default draggable options
  var that = {                  
    appendTo : "body",  //allows dragging out of frame to new object
    helper : "clone",   //makes helper look just like original draggable
    revert : "invalid",  //glide back into place if not dropped on target
  };

  return that;
};

  /*************************/
 /***** CALENDAR WEEK *****/
/*************************/

moment.lang('en', { //overriding calendar formatting from moment.js
    calendar : {
        lastDay : 'ddd[,] MMM D',
        sameDay : '[Today]',
        nextDay : 'ddd[,] MMM D',
        lastWeek : 'ddd[,] MMM D',
        nextWeek : 'ddd[,] MMM D',
        sameElse : 'ddd[,] MMM D'
    }
});

Template.calendarWeek.helpers({
  weekDays: function() {
    var Monday = moment(this.monOfWeek,'ddd[,] MMM D YYYY');
    var Friday = moment(this.monOfWeek,'ddd[,] MMM D YYYY').add('days',4).add('hours',1);
    var weekDays = [];
    for (day = Monday; day.isBefore(Friday); day.add('days',1)) {
      weekDays.push({
        ID: day.format('MMM[_]D[_]YYYY'),
        day: day.calendar()
      });
    };
    return weekDays;
  }           
});

  /*************************/
 /***** CALENDAR DAY ******/
/*************************/

Template.calendarDay.rendered = function() {
  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
};

Template.calendarDay.helpers({ 
  daysEvents : function() {
    var date = moment(this.ID,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
    var userToShow = Session.get('TeacherViewIDs');
    var workPlaces = Session.get('visibleWorkplaces')
    var calendarEvents;
    if (userToShow) {
      calendarEvents =  CalendarEvents.find({group: {$in: userToShow}, 
        workplace: {$in: workPlaces},
        eventDate: date}).fetch();
      return calendarEvents.filter(function (cE) {
        var activity = Activities.findOne(cE.activityID);
        if (!activity) return false;
        if (activity.modelID == 'wholecourse') return true;
        var model = Models.findOne(activity.modelID);
        if (!model) return false;
        return (activity.visible && model.visible);
      });
    }
    return '';
  },
  frozen: function() {
    var userIDToShow = Meteor.userId();
    var isTeacher = Roles.userIsInRole(userIDToShow,'teacher');
    var iconThawed = (isTeacher) ? 'icon-thawed' : '';
    var iconFrozen = (isTeacher) ? 'icon-frozen' : 'icon-frozen-student';
    if (isTeacher) {
      userIDToShow = Session.get('TeacherViewAs');
    };
    var userToShow = Meteor.users.findOne(userIDToShow);
    var section = (userToShow && ('profile' in userToShow) && ('sectionID' in userToShow.profile))
     ? Sections.findOne(userToShow.profile.sectionID) : Sections.findOne(userIDToShow);
    var site = Site.findOne();
    var date = this.ID;
    var day;
    if (userToShow && ('frozen' in userToShow)) {
      day = _.find(userToShow.frozen,function(f) {return (f.date == date)});
      if (day) return day.frozen ?  iconFrozen : iconThawed;
    }
    if (section && 'frozen' in section) {
      day = _.find(section.frozen,function(f) {return (f.date == date)});
      if (day) return day.frozen ?  iconFrozen : iconThawed;
    }
    if (!('frozen' in site)) return iconThawed;   
    return (_.contains(site.frozen,date)) ?  iconFrozen : iconThawed;
  }
});

Template.calendarDay.events({
  'click .icon-thawed' : function(event) {
    var userToShow = Meteor.userId();
    if (!Roles.userIsInRole(userToShow,'teacher')) return;
    userToShow = Session.get('TeacherViewAs');
    Meteor.call('Freeze',$(event.target).data('day'),userToShow,true);
  },
  'click .icon-frozen' : function(event) {
    var userToShow = Meteor.userId();
    if (!Roles.userIsInRole(userToShow,'teacher')) return;
    userToShow = Session.get('TeacherViewAs');
    Meteor.call('Freeze',$(event.target).data('day'),userToShow,false);
  }
});

var SortOpt = function (connector) { //default sortable options

  var start = function(event,ui) { //stores current location of helper
    var element = $(ui.item[0]);
    element.data('lastParent', element.parent());
  };

  var activate = function(event, ui) {  //puts placeholders on all targets
    $( this).prepend($('<p class="ui-state-default placeholder">.</p>'));
    $(ui.sender).find('.placeholder').hide(); //except for the sortable it was dragged from
  };

  var over = function(event, ui) { //shows placeholders on all other targets
    $('.placeholder').show();
    $(this).find('.placeholder').hide();
  };
  
  var stop = function(event, ui) {  
    $( '.placeholder').remove();  //removes all placeholders on page
  };

  var receive = function(event, ui) { 
    var eventID = ui.item.data('eventid');
    var IG = { //Invite Group, for session variable
      eventDate: moment(this.id,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY'),
      activityID: ui.item.data('activityid'),
      group: []
    }
    var OpenInvites= CalendarEvents.find({activityID: IG.activityID, eventDate: IG.eventDate, invite: {$in: [Meteor.userId()]}});
    var currentUser = Meteor.user();

    if (currentUser && currentUser.profile && currentUser.profile.sectionID) {
      IG.sectionID =   currentUser.profile.sectionID;   
    } else {
      IG.sectionID = Sections.findOne()._id;
    };    
    
    $( '.placeholder').remove();
    if (eventID && CalendarEvents.find(eventID).count()) { //just moved to new date
      Meteor.call('changeDate', eventID, IG.eventDate, 
        function(error, id) {
          if (error) {
            var lastParent = ui.item.data('lastParent');
            if (lastParent) $(lastParent).append(ui.item); //moves jquery,ui helper back to its original position
            return alert(error.reason);
          } else {
            ui.item.remove(); // removes jquery.ui helper 
          }
        }
      );
      
    } else if (OpenInvites.count() ) { 
      Session.set("OpenInvites",{'eventDate': IG.eventDate,'activityID': IG.activityID});
      $('#openInviteDialog').data('daysActivities',$(this)).modal();  
    } else { 
      Session.set("joinGroup",IG);
      //$('#joinGroupDialog').modal();
      $('#joinGroupDialog').data('daysActivities',$(this)).modal();  //pass list object from calendar day 
      //Session.set("InviteGroup",IG);
      //$('#inviteGroupDialog').data('daysActivities',$(this)).modal();  //pass list object from calendar day 
    };
  };

  var that = {
    connectWith : connector,  //connect with other lists
    revert : false,            //smooth slide onto target
    forcePlaceholderSize : true,  //allows dropping on empty list
    tolerance : 'pointer',    
    placeholder : "ui-state-highlight", //yellow
    activate : activate,
    helper: 'clone', //for some reason stops click event also firing on receive when dragging event to change date
    start: start,
    over : over,
    stop : stop,
    receive : receive
  };

  return that;
};

  /*************************/
 /***** CALENDAR EVENT ****/
/*************************/

Template.calendarEvent.rendered = function() {
  $(this.find('p')).droppable(DropOpt());
}; 

Template.calendarEvent.events({
  'click .remove': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var userToShow = null;
    if (Roles.userIsInRole(Meteor.userId(),'teacher'))
      userToShow = Session.get('TeacherViewAs');
    Meteor.call('deleteEvent', eventID, userToShow, 
      function(error, id) {if (error) return alert(error.reason);}
    );
   },
  'click a': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var calendarEvent = CalendarEvents.findOne(eventID);
    Session.set('currentGroup',calendarEvent.group);
  },
  'click .invitemore': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var cE = CalendarEvents.findOne(eventID);
    var IG = { //Invite Group, for session variable
      eventID: cE._id,
      eventDate: cE.eventDate,
      activityID: cE.activityID,
      group: cE.invite,
      currentGroup: cE.group
    }
    var cU = Meteor.user();
    if (cU && cU.profile && cU.profile.sectionID) {
      IG.sectionID = cU.profile.sectionID;   
    } else {
      IG.sectionID = Sections.findOne()._id;
    }; 
    Session.set("InviteGroup",IG);
    $('#inviteGroupDialog').data('daysActivities',$(this)).modal();  //pass list object from calendar day 
  }
});

Template.calendarEvent.helpers({
  title: function() {
    return Activities.findOne(this.activityID).title;
  },
  classes: function() {
    return "ui-state-default" + " " + this.workplace;
  },
  reassessment: function() { 
    var userToShow = Meteor.userId();
    var activity = Activities.findOne(this.activityID);
    if (!activity) return '';
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var ownerID =  activity.hasOwnProperty('ownerID') ? activity.ownerID : '';
    if ((activity.type == 'assessment') && !ownerID) 
      return '<strong>assessment: </strong>';
    return ((activity.type == 'assessment') && ownerID && (ownerID == userToShow) ) ? '<strong>Reassessment: </strong>' : '';
  }  
});




var DropOpt = function () { 
  var newClass, currentClass; 

  var activate = function (event, ui) {
    var workPlaces = ['inClass','outClass','home'];
    var newWorkplace = _.intersection(workPlaces,ui.draggable[0].classList);
    if (newWorkplace.length == 1) {
      newClass = newWorkplace[0];
    };
  };

  var over = function (event, ui) {
    var eventID = $(event.target).data('eventid');
    var workPlaces = ['inClass','outClass','home'];
    var currentWorkplace = _.intersection(workPlaces,event.target.classList);
    if (currentWorkplace.length == 1) {
      currentClass = currentWorkplace[0];
    };
    if (newClass) {
      Meteor.call('changeWorkplace', eventID, newClass, 
        function(error, id) {if (error) return alert(error.reason);}
      );
    };
  };

  var out = function (event, ui) {
    var eventID = $(event.target).data('eventid');
    if (currentClass) {
      Meteor.call('changeWorkplace', eventID, currentClass, 
        function(error, id) {if (error) return alert(error.reason);}
      );
    };
  };

  var that = {                  
    accept : '#inClassSwatch, #outClassSwatch, #homeSwatch',
    tolerance : "touch",
    activate : activate,
    over : over,
    out  : out
  };

  return that;
};





