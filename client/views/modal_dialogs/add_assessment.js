Template.addAssessment.rendered = function() {
  var $title = $(this.find('#title'));
  $title.hallo().bind( "hallodeactivated", function(event) {
    var $t = $(event.target); 
    var newAssessment = Session.get('newAssessment');    
    newAssessment.title = _.clean(_.stripTags($t.text()));
    Session.set('newAssessment',newAssessment);
  });
  $title.data('defaultText',$title.html());
  $('#assessment').droppable(dropOpt());
};

Template.addAssessment.events({
  'click #saveNewAssessment': function(event,tmpl) {
    var cU = Meteor.userId();
    var newAssessment = Session.get('newAssessment');
    if (Roles.userIsInRole(cU,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
      if (Roles.userIsInRole(userToShow,'student')) {
        userToShow = Meteor.users.findOne(userToShow);
      } else {
        userToShow = null;
      }
    } else {
      if (Roles.userIsInRole(cU,'student')) {
        userToShow = Meteor.users.findOne(cU);
      } else {
        userToShow = null;
      }
    }
    if (userToShow) 
      newAssessment.ownerID = userToShow._id;
    Meteor.call('postActivity',newAssessment,function(error,id) {
      if (error) 
        return alert(error.reason);
      Session.set('newAssessment',{});
      var $title = $('#title');
      $title.addClass("defaultTextActive");
      $title.text($title.data('defaultText'));
      $('#addAssessmentDialog').modal('hide');      
    });


  },
  'focus #title':function(event) {
    var $title = $(event.target);
    if ($title.html() == $title.data('defaultText')) {
      $title.removeClass("defaultTextActive");
      $title.text("");
    };
  },
  'blur #title':function(event) {
    var $title = $(event.target);
    if ($title.html() == '') {
      $title.addClass("defaultTextActive");
      $title.text($title.data('defaultText'));
    };
  },
  'click i.remove' : function(event) {
    Session.set('newAssessment',{});
    var $title = $('#title');
    $title.addClass("defaultTextActive");
    $title.text($title.data('defaultText'));
    $('#addAssessmentDialog').modal('hide');
  }
});

Template.addAssessment.helpers({
  addAssessment: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    }
    if (Roles.userIsInRole(userToShow,'teacher')) return 'Add Assessment';
    if (Roles.userIsInRole(userToShow,'student')) return 'Add Reassessment';
    return '';
  },
  standards: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('standardIDs') && newAssessment.standardIDs.length) {
      return Standards.find({_id: {$in: newAssessment.standardIDs}},
        {sort: {rank: 1}});      
    } else {
      return '';
    }
  }
});

var dropOpt = function () { //droppable options
  var activate = function(event,ui) {
    $(this).addClass('ui-state-default');
  };
  var over = function (event, ui) {
    $(this).switchClass('ui-state-default','ui-state-highlight',0);
  };
  var out = function(event,ui) {
    $(this).switchClass('ui-state-highlight','ui-state-default',0);
    if (ui.draggable.hasClass('draggingOut'))
      ui.draggable.switchClass('draggingOut','draggedOut',0);
  };
  var deactivate = function(event,ui) { //called after drop
    $(this).removeClass('ui-state-default ui-state-highlight');
    if (ui.draggable.hasClass('draggedOut')) {
      var elData = UI.getElementData(ui.draggable.get(0));
      var standard = Standards.findOne(elData._id);
      var newAssessment = Session.get('newAssessment');
      if (standard) {
        if (newAssessment.hasOwnProperty('standardIDs')) {
          newAssessment.standardIDs = _.without(newAssessment.standardIDs,standard._id);
        }
        Session.set('newAssessment',newAssessment);
      };    
    };
  };
  var drop = function(event, ui) {
    var elData = UI.getElementData(ui.draggable.get(0));
    var standard = Standards.findOne(elData._id);
    var newAssessment = Session.get('newAssessment');
    if (standard) {
      if (newAssessment.hasOwnProperty('standardIDs')) {
        newAssessment.standardIDs.push(standard._id);
      } else {
        newAssessment.standardIDs = [standard._id];
      }
      Session.set('newAssessment',newAssessment);
    };
  };

  var that = {
    accept: '.assessmentStand',
    activate: activate,
    over: over,
    out: out,
    deactivate: deactivate,
    drop: drop
  };

  return that;
};