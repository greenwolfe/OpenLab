  /*************************/
 /*** ACTIVITIES LIST  ****/
/*************************/

Template.activitiesList.rendered = function() {
  $('#activities').accordion({heightStyle: "content"});
}

Template.activitiesList.helpers({
  models: function() {
    return Models.find({visible:true},{sort: {rank: 1}});
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
    return Activities.find({modelID: this._id, ownerID: {$nin: [Meteor.userId()]},visible: true},{sort: {rank: 1}}); 
  },
  reassessments: function() {
    return Activities.find({modelID: this._id, ownerID: {$in: [Meteor.userId()]},visible: true},{sort: {rank: 1}});
  },
  openInviteCount: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var activities = Activities.find({modelID: this._id,visible:true});
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
  $(this.find("p")).draggable(DragOpt('.daysActivities') );
};

Template.activityItem.events({
  'click a': function(event) {
    var TVA;
    var currentUserID = Meteor.userId();
    if (currentUserID && Roles.userIsInRole(currentUserID,'teacher')) {
       TVA = Session.get('TeacherViewAs');
       if (Meteor.user(TVA) || Sections.findOne(TVA)) {
        Session.set('currentGroup',[TVA]);
      };
    } else {
      Session.set('currentGroup',[Meteor.userId()]);
    };
  },
  'click p .remove': function(event,ui) {
    var Activity = UI.getElementData( $(event.target).parent().get(0) );
    var currentAssessment = Session.get('currentAssessment');
    if (Activity.hasOwnProperty('standardIDs') && (Activity.standardIDs.length == 0)) {
      if (currentAssessment && currentAssessment.hasOwnProperty('standardIDs') && (currentAssessment._id == Activity._id))
        Session.set('currentAssessment','');
      Meteor.call('deleteActivity',Activity._id);
    }
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
  },
  assessmentAct: function () {
    var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    return (ownerID && (ownerID == Meteor.userId() ) ) ? 'assessmentAct' : '';
  },
  reassessment: function() {
    var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    return (ownerID && (ownerID == Meteor.userId() ) ) ? '<strong>Reassessment: </strong>' : '';
  },
  deleteable: function() {
    var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    var hasStandards = (this.hasOwnProperty('standardIDs') && this.standardIDs.length);
    //also check for notes, todos and links ... similar in teacher edit and the method in the collection itself
    return ( (ownerID == Meteor.userId()) && !hasStandards);
  }
});

  /**************************/
 /***** NEW ASSESSMENT  ****/
/**************************/

var defaultText = 'Edit this text to create a new assessment.'; 

Template.newAssessment.helpers({
  defaultText: function() {
    return defaultText;
  } 
 }); 

Template.newAssessment.rendered = function() {
  var cU = Meteor.user();
  if (cU) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var title = _.clean(_.stripTags($t.text()));
      var el = $t.get(0);
      var modelID = (el) ? UI.getElementData(el)._id : NaN;
      var nA = {
          modelID: modelID,
          title: title,
          ownerID: cU._id
      };
      Meteor.call('postActivity',nA,defaultText,
        function(error, id) {if (error) return alert(error.reason);}
      );
      $t.text(defaultText);
    });
  };
};

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





