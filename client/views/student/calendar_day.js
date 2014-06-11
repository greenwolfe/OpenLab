Template.calendarDay.rendered = function() {
  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
}

Template.calendarDay.helpers({ 
  daysEvents : function() {
     var date = moment(this.ID,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
    return CalendarEvents.find({group: {$in: [Meteor.userId()]}, date: date}); //syntax is backwards.  Checks if current user is in the group array.
  },

  event : function() { // gets activityID because called within #each loop over daysEvents helper
    return Activities.findOne(this.activityID);
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
    $( '.placeholder').remove();
    if (eventID && CalendarEvents.find(eventID).count()) { //was just moved to new date
      CalendarEvents.update(eventID,{$set: {date : date} });
      $(this).find('p:not([data-eventid])').remove(); //calendar_event.html adds data-eventid when placing event in calendar, the duplicate event placed by jquery-ui on end of sort does not have this field, and is no longer needed to hold the place. 
    } else if ( CalendarEvents.find({activityID: activityID, date: date, invite: {$in: [Meteor.userId()]}}).count() ) { //open invitation
      console.log('open invitation');
      //call open invitation dialog
    } else {
      $('#inviteGroupDialog').data('eventDate',date).data('activityid',ui.item.data("activityid")).data('caller',$(this)).dialog("open"); //pass date, activityid, dialog object itself to dialog's data object
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

