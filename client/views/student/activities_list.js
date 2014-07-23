  /*************************/
 /*** ACTIVITIES LIST  ****/
/*************************/

Template.activitiesList.rendered = function() {
  $('#activities').accordion({heightStyle: "content"});
}

Template.activitiesList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  }
});


  /*************************/
 /** ACTIVITIES SUBLIST  **/
/*************************/

Template.activitiesSublist.rendered = function() {
  if ($( "#activities" ).data('ui-accordion')) //if accordion already applied
    $('#activities').accordion("refresh");
};

Template.activitiesSublist.helpers({
  activities: function() {
    return Activities.find({modelID: this._id},{sort: {rank: 1}}); 
  },
  openInviteCount: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var activities = Activities.find({modelID: this._id});
    var count = 0;
    activities.forEach(function (activity) {
      count += CalendarEvents.find({activityID: activity._id, invite: {$in: [userToShow]}}).count();
    });
    return count;
  }
});


  /*************************/
 /***** ACTIVITY ITEM  ****/
/*************************/

Template.activityItem.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("p")).draggable(DragOpt('.daysActivities') );
  };
};

Template.activityItem.events({
  'click a': function(event) {
    Session.set('currentGroup',[Meteor.userId()]);
  }
});

Template.activityItem.helpers({
  openInvites: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var calendarEvents = CalendarEvents.find({activityID: this._id, invite: {$in: [userToShow]}});
    var openInvites = [];
    if (!calendarEvents) return '';
    calendarEvents.forEach(function (event) {
      openInvites.push({
        date: moment(event.eventDate,'ddd[,] MMM D YYYY').format('ddd[,] MMM D'),
        group: _.without( event.invite.concat(event.group), userToShow )
      });
    });
    return openInvites;
  }
});

var DragOpt = function (sortable) { //default draggable options
  var pos_fixed = 1;
  var start = function(event,ui) {
    pos_fixed = 0;
  };
  var drag = function(event,ui) { //corrects bug where scrolling of main window displaces helper from mouse
    if (pos_fixed == 0) {
      $(ui.helper).css('margin-top',$(event.target).offset().top - $(ui.helper).offset().top);
      pos_fixed = 1;
    };
  };
  var stop = function (event, ui) {  // so it can't be modified from outside
    $('.placeholder').remove();  //remove all placeholders on the page
  };

  var that = {                  
    connectToSortable : sortable,  //drag target
    appendTo : "body",  //allows dragging out of frame to new object
    helper : "clone",   
    revert : "invalid",  //glide back into place if not dropped on target
    start : start,
    drag : drag,
    stop : stop
  };

  return that;
};


