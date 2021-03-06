  /*************************/
 /*** ACTIVITIES LIST  ****/
/*************************/

Template.activitiesList.helpers({
  models: function() {
    return Models.find({visible:true},{sort: {rank: 1}});
  },
  activeUnit: function() {
    return Models.findOne(Session.get('activeUnit'));
  },
  rabbits: function() {
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!!rabbits & (rabbits.length > 0))
      return rabbits[0].username + "'s";
    return 'expected';
  }
});

  /*********************/
 /** UNIT TITLE      **/
/*********************/

Template.unitTitle.helpers({
  active: function() {
    var activeUnit = Session.get('activeUnit');
    if (!activeUnit) {
      var units = Models.find({visible:true},{sort: {rank: 1}}).fetch();
      var cU = Meteor.user();
      activeUnit = units[0]._id;
      if (cU && ('profile' in cU) && ('lastOpened' in cU.profile) && 
        ('studentActivityList' in cU.profile.lastOpened) && 
        Models.findOne(cU.profile.lastOpened.studentActivityList)) 
          activeUnit = cU.profile.lastOpened.studentActivityList;
      Session.set('activeUnit', activeUnit);
    }
    return (this._id == activeUnit) ? 'active' : '';
  },
  percentCompleted: function() {
    var userToShow = Meteor.userId();
    var activities = Activities.find({modelID: this._id, 
      ownerID: {$in: [null,'']}, //matches if Activities does not have onwerID field, or if it has the field, but it contains the value null or an empty string
      visible: true}).fetch();
    var completed = 0;
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    userToShow = Meteor.users.findOne(userToShow);
    if (userToShow && (userToShow.hasOwnProperty('activityStatus') || userToShow.hasOwnProperty('completedActivities'))) {
      activities.forEach(function(act) {  
        var done = 0;
        if (userToShow.hasOwnProperty('completedActivities')) {
          if (_.contains(userToShow.completedActivities,act._id))
            done = 1;          
        }
        if (userToShow.hasOwnProperty('activityStatus')) {
          var status = _.findWhere(userToShow.activityStatus,{_id:act._id});
          if (status) 
            done = ((status.status == 'done') || (status.status == 'donewithcomments')) ? 1 : 0;       
        } 
        completed += done;
      });
    }
    return completed*100/activities.length;
  },
  percentExpected: function() {
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!rabbits || (rabbits.length == 0))
      return 0;
    var rabbit = rabbits[0];
    var activities = Activities.find({modelID: this._id, 
      ownerID: {$in: [null,'']}, //matches if Activities does not have onwerID field, or if it has the field, but it contains the value null or an empty string
      visible: true}).fetch();
    var completed = 0;
    if ((rabbit.hasOwnProperty('activityStatus') || rabbit.hasOwnProperty('completedActivities'))) {
      activities.forEach(function(act) {  
        var done = 0;
        if (rabbit.hasOwnProperty('completedActivities')) {
          if (_.contains(rabbit.completedActivities,act._id))
            done = 1;          
        }
        if (rabbit.hasOwnProperty('activityStatus')) {
          var status = _.findWhere(rabbit.activityStatus,{_id:act._id});
          if (status) 
            done = ((status.status == 'done') || (status.status == 'donewithcomments')) ? 1 : 0;       
        } 
        completed += done;
      });
    }
    return completed*100/activities.length;
  }
});

Template.unitTitle.events({
  'click li a': function(event,tmpl) {
    event.preventDefault();
    Session.set('activeUnit',tmpl.data._id);
    var cU = Meteor.user();
    if (cU && ('profile' in cU)) {
      Meteor.users.update({_id:cU._id}, { $set:{"profile.lastOpened.studentActivityList":tmpl.data._id} });
    }
  }
})


  /*************************/
 /** ACTIVITIES SUBLIST  **/
/*************************/

Template.activitiesSublist.helpers({
  activities: function(whichHalf) {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var Acts = Activities.find({modelID: this._id, //general activities created by teacher
      ownerID: {$in: [null,'']}, //matches if Activities does not have onwerID field, or if it has the field, but it contains the value null or an empty string
      visible: true},
      {sort: {rank: 1}}).fetch(); 
    var R = Activities.find({modelID: this._id, //reassessments for a particular student
            ownerID: {$in: [userToShow]},
            type: 'assessment',
            visible: true},
            {sort: {rank: 1}}).fetch();
    Acts = Acts.concat(R);  //reassessments at end of list
    /*Acts.forEach(function(A,i) {
      A.irank = i;
    });
    var max = Acts.length - 1;
    var half = Math.floor(max/2);
    Acts.sort(function(A,B) {  //reorder for presentation in two columns
      var Ai = (A.irank <= half) ? 2*A.irank : 2*A.irank - max + max%2 - 1;
      var Bi = (B.irank <= half) ? 2*B.irank : 2*B.irank - max + max%2 - 1;      
      return Ai-Bi;
    });*/
    return (whichHalf == 1) ? Acts.slice(0,Math.ceil(Acts.length/2)) : Acts.slice(Math.ceil(Acts.length/2)); 
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
  }
});


  /*************************/
 /***** ACTIVITY ITEM  ****/
/*************************/
var lastClicked = {  //records last click to determine when to decrement 
  userID: null,
  studentID: null,
  activityID: null,
};
var Increment = 1;

Template.activityItem.rendered = function() {    
  $(this.find("p")).draggable(DragOpt('.daysActivities') );
};

Template.activityItem.events({
  'click i.activityStatus': function(event) {
    var cU = Meteor.user();
    var userToShow = cU._id;
    cU.isTeacher = Roles.userIsInRole(cU,'teacher');
    cU.isStudent = Roles.userIsInRole(cU,'student');
    if (cU.isTeacher) {
      userToShow = Session.get('TeacherViewAs');
    };
    var student = Meteor.users.findOne(userToShow);
    var status = null;
    if (student && student.hasOwnProperty('activityStatus')) 
      status = _.findWhere(student.activityStatus,{_id:this._id});
    //deprecated ... checking for status under old system
    if ((!status) && student && student.hasOwnProperty('completedActivities')) {
      if (_.contains(student.completedActivities,this._id)) {
        status = {status:'done'};
      } else {
        status = {status:'notStarted'};
      };
    };
    //end deprecated section
    if (!status) status = {status:'notStarted'};

    var justClicked = {  
      userID: cU._id,
      studentID: userToShow,
      activityID: this._id,
    };
    if (_.isEqual(justClicked,lastClicked)) {
      if (cU.isStudent && (status.status== 'submitted')) Increment = -1;
      if (cU.isTeacher && (status.status == 'done'))  Increment = -1;
      if (status.status == 'notStarted') Increment = 1;
    } else {
      lastClicked = justClicked;
      Increment = 1;
      if (cU.isStudent && (status.status== 'submitted')) Increment = -1;
      if (cU.isTeacher && (status.status == 'done'))  Increment = -1;
    };
    Meteor.call('activityIncrementStatus',this._id,userToShow,Increment,
      function(error, id) {
        if (error) {
          return alert(error.reason);
        } else { //register subscription in case this is the first completed Activity
                 //and the user does not have a completedActivities field yet.
          Meteor.subscribe('activityStatus',userToShow); 
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
  },
  'click .openInvite .remove': function(event) {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    var calendarEvent = UI.getElementData( $(event.currentTarget).get(0) );
    Meteor.call('declineInvite', calendarEvent._id, userToShow, 
      function(error, id) {if (error) return alert(error.reason);}
    );
   },
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
        _id: event._id,
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
  status: function() {
    var userToShow = Meteor.userId();
    var status;
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    userToShow = Meteor.users.findOne(userToShow);
    if (userToShow && userToShow.hasOwnProperty('activityStatus')) {
      status = _.findWhere(userToShow.activityStatus,{_id:this._id});
      if (status) {
        return 'icon-' + status.status;
      }
    }
    //deprecated checking to see if there's a status posted using the old system
    if (userToShow && userToShow.hasOwnProperty('completedActivities')) {
      return _.contains(userToShow.completedActivities,this._id) ? 'icon-done' : 'icon-notStarted';
    }
    return 'icon-notStarted';   
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
  },
  expected: function() {
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!rabbits || (rabbits.length == 0)) return '';
    var rabbit = rabbits[0];
    if (rabbit.hasOwnProperty('completedActivities') && (_.contains(rabbit.completedActivities,this._id))) 
      return "expected"
    if (rabbit.hasOwnProperty('activityStatus')) {
      var status = _.findWhere(rabbit.activityStatus,{_id:this._id});
      if ((status) && ((status.status == 'done') || (status.status == 'donewithcomments')))
        return 'expected';       
    }
    return '';
  },
  completed: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    };
    userToShow = Meteor.users.findOne(userToShow);
    if (!userToShow) return '';
    if (userToShow.hasOwnProperty('completedActivities') && (_.contains(userToShow.completedActivities,this._id))) 
      return "completed"
    if (userToShow.hasOwnProperty('activityStatus')) {
      var status = _.findWhere(userToShow.activityStatus,{_id:this._id});
      if ((status) && ((status.status == 'done') || (status.status == 'donewithcomments')))
        return 'completed';       
    }
    return '';
  }
});

  /**************************/
 /***** NEW ASSESSMENT  ****/
/**************************/

 

Template.newAssessment.helpers({
  clickToAdd: function() {
    var cU = Meteor.userId();
    if (Roles.userIsInRole(cU,'teacher')) {
      var userToShow = Session.get('TeacherViewAs');
      userToShow = Meteor.users.findOne(userToShow);
      if (userToShow && Roles.userIsInRole(userToShow,'student')) {
        return 'Click to add Reassessment for ' + userToShow.username;
      } else {
        return 'Click to add activity';
      };
    };
    if (Roles.userIsInRole(cU,'student'))
      return 'Click to add reassessment.';
    return '';
  } 
 }); 

/*Template.newAssessment.rendered = function() {
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
        function(error, id) {
          if (error) return alert(error.reason);
        }
      );
      $t.text(defaultText);
    });
  };
}; */

Template.newAssessment.events({
  'click #addAssessment': function(event,tmpl) {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) 
      var userToShow = Session.get('TeacherViewAs');
    userToShow = Meteor.users.findOne(userToShow);
    Session.set('newAssessment',{
      modelID:this._id,
      type: (Roles.userIsInRole(userToShow,'student')) ? 'assessment' : 'activity'
    });
    $('#addAssessmentDialog').modal();
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





