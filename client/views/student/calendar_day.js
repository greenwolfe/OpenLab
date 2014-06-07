Template.calendarDay.rendered = function() {
  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
}

Template.calendarDay.helpers({ 
  daysEvents : function() {
     var date = moment(this.ID,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
    return CalendarEvents.find({user: Meteor.userId(), date: date});
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
    $( '.placeholder').remove();
    if (eventID && CalendarEvents.find(eventID).count()) { 
      CalendarEvents.update(eventID,{$set: {date : date} }); 
    } else {
      calendarEvent = {
        user : Meteor.userId(),
        date : date,
        activityID : ui.item.data("activityid")
      };
      CalendarEvents.insert(calendarEvent);
    };
    $(this).find('p:not([data-eventid])').remove();
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

