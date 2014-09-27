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
    return Activities.find({modelID: this._id, 
      ownerID: {$in: [null,'']}, //matches if Activities does not have onwerID field, or if it has the field, but it contains the value null or an empty string
      visible: true},
      {sort: {rank: 1}}); 
  },
  reassessments: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    return Activities.find({modelID: this._id, 
      ownerID: {$in: [userToShow]},
      type: 'assessment',
      visible: true},
      {sort: {rank: 1}});
  },
  openInviteCount: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var activities = Activities.find({modelID: this._id,visible:true});
    var count = 0;
    activities.forEach(function (activity) {
      count += CalendarEvents.find({activityID: activity._id, 
        invite: {$in: [userToShow]}}).count();
    });
    return count;
  },
  activitiesCompleted: function() {
    var userToShow = Meteor.userId();
    var activities = Activities.find({modelID: this._id, 
      ownerID: {$in: [null,'']}, //matches if Activities does not have onwerID field, or if it has the field, but it contains the value null or an empty string
      visible: true}).fetch();
    var count = 0;
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    userToShow = Meteor.users.findOne(userToShow);
    if (userToShow && userToShow.hasOwnProperty('completedActivities'))  {
      activities.forEach(function(act) {
        if (_.contains(userToShow.completedActivities,act._id))
          count += 1;
      });
      return ' (' + count + '/' + activities.length + ')'; 
    }  else {
      return ' (0/' + activities.length + ')'; 
    }
  }
});


  /*************************/
 /***** ACTIVITY ITEM  ****/
/*************************/

Template.activityItem.rendered = function() {    
  $(this.find("p")).draggable(DragOpt('.daysActivities') );
};

Template.activityItem.events({
  'click i.fa-square-o': function(event) {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    Meteor.call('activityMarkDone',this._id,userToShow,
      function(error, id) {
        if (error) {
          return alert(error.reason);
        } else { //register subscription in case this is the first completed Activity
                 //and the user does not have a completedActivities field yet.
          Meteor.subscribe('completedActivities',userToShow); 
        }
      }
    );   
  },
  'click i.fa-check-square-o': function(event) {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    Meteor.call('activityMarkNotDone',this._id,userToShow,
      function(error, id) {        
        if (error) {
          return alert(error.reason);
        } else { //shouldn't need this here ??
          Meteor.subscribe('completedActivities',userToShow);
        }
      }
    );    
  },
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
      Meteor.call('deleteActivity',Activity._id,
        function(error, id) {if (error) return alert(error.reason);}
      );
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
    //var userToShow = Meteor.userId();
    //if (Roles.userIsInRole(userToShow,'teacher')) {
    //  userToShow = Session.get('TeacherViewAs');
    //};
    //var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    //return ((this.type  == 'assessment') && ownerID && (ownerID == userToShow ) ) ? 'assessmentAct' : '';
    return (this.type == 'assessment') ? 'assessmentAct' : '';
    //seems good for now ... leaving above in case troubles arise
  },
  reassessment: function() { 
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    if ((this.type == 'assessment') && !ownerID) 
      return '<strong>assessment: </strong>';
    return ((this.type == 'assessment') && ownerID && (ownerID == userToShow) ) ? '<strong>Reassessment: </strong>' : '';
  },
  completed: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    userToShow = Meteor.users.findOne(userToShow);
    if (userToShow && userToShow.hasOwnProperty('completedActivities')) {
      return _.contains(userToShow.completedActivities,this._id) ? 'fa fa-check-square-o' : 'fa fa-square-o';
    }
    return 'fa fa-square-o';   
  },
  deleteable: function() {
    var userToShow = Meteor.userId();
    var ownerID =  this.hasOwnProperty('ownerID') ? this.ownerID : '';
    var hasStandards = (this.hasOwnProperty('standardIDs') && this.standardIDs.length);
    if (Roles.userIsInRole(userToShow,'teacher')) {
      return ((this.type == 'assessment') && !hasStandards);
    };
    //also check for notes, todos, calendarEvents and links ... similar in teacher edit and the method in the collection itself
    //check chould be performed on the server as not all may be subscribed to on the client   
    return ((this.type == 'assessment') && (ownerID == userToShow) && !hasStandards);
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
  if (cU && Roles.userIsInRole(cU,['teacher','student'])) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var title = _.clean(_.stripTags($t.text()));
      var el = $t.get(0);
      var modelID = (el) ? UI.getElementData(el)._id : NaN;
      var nA = {
          modelID: modelID,
          title: title,
          type: 'assessment'
      };
      if (Roles.userIsInRole(cU,'student')) 
        nA.ownerID = cU._id;
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





