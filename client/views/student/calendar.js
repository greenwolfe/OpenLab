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

  $('#inClassSwatch, #outClassSwatch, #homeSwatch').draggable(DragOpt('.daysActivities') );
};






var DateOpt = function(sessionKey) { //default datepicker options
  var onSelect = function(dateText,Object){
    Monday = moment(dateText,'ddd[,] MMM D YYYY').day("Monday");
    Monday = Monday.format('ddd[,] MMM D YYYY');
    Session.set(sessionKey,Monday); //Meteor takes care of not invalidating templates and causing re-rendering if the key is set to an identical value, and therefore not changed
  };
  var that = {
    dateFormat:'D, M dd yy',
    onSelect: onSelect,
    helper: "clone"
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
    return CalendarEvents.find({group: {$in: [Meteor.userId()]}, eventDate: date}); //syntax is backwards.  Checks if current user is in the group array.
  }
});

var SortOpt = function (connector) { //default sortable options

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
    var date = moment(this.id,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
    var eventID = ui.item.data('eventid');
    var activityID = ui.item.data('activityid');
    var OpenInvites= CalendarEvents.find({activityID: activityID, eventDate: date, invite: {$in: [Meteor.userId()]}});
    $( '.placeholder').remove();
    if (eventID && CalendarEvents.find(eventID).count()) { //just moved to new date
      CalendarEvents.update(eventID,{$set: {eventDate : date} });
      $(this).find('p:not([data-eventid])').remove(); // see note below 
    } else if (OpenInvites.count() ) { 
      Session.set("OpenInvites",{'eventDate': date,'activityID': activityID});
      $('#openInviteDialog').data('daysActivities',$(this)).modal();  
    } else { 
      Session.set("InviteGroup",{'eventDate': date,'activityID': activityID});
      $('#inviteGroupDialog').data('daysActivities',$(this)).modal();  //pass list object from calendar day 
    };
  };

  var that = {
    connectWith : connector,  //connect with other lists
    revert : false,            //smooth slide onto target
    forcePlaceholderSize : true,  //allows dropping on empty list
    tolerance : 'pointer',    
    placeholder : "ui-state-highlight", //yellow
    activate : activate,
    over : over,
    stop : stop,
    receive : receive
  };

  return that;
};

//calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place. 

  /*************************/
 /***** CALENDAR EVENT ****/
/*************************/

Template.calendarEvent.rendered = function() {
  $(this.find('p')).droppable(DropOpt());
}; 

Template.calendarEvent.events({
  'click .remove': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var calendarEvent;
    CalendarEvents.update(eventID,{$pull: {group : Meteor.userId()}});
    CalendarEvents.update(eventID,{$addToSet: {invite : Meteor.userId()}}); 
    calendarEvent = CalendarEvents.findOne(eventID); 
    if (calendarEvent.group.length == 0) {
      CalendarEvents.remove(eventID);
    } 
   },
  'click a': function(event) {
    var eventID = $(event.currentTarget.parentElement).data('eventid');
    var calendarEvent = CalendarEvents.findOne(eventID);
    Session.set('currentGroup',calendarEvent.group);
  }
});

Template.calendarEvent.helpers({
  title: function() {
    return Activities.findOne(this.activityID).title;
  },
  classes: function() {
    return "ui-state-default" + " " + this.workplace;
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
      CalendarEvents.update(eventID,{$set: {workplace: newClass}});
    };
  };

  var out = function (event, ui) {
    var eventID = $(event.target).data('eventid');
    if (currentClass) {
      CalendarEvents.update(eventID,{$set: {workplace: currentClass}});
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





