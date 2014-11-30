Template.addAssessment.rendered = function() {
  var $title = $(this.find('#title'));
  $title.hallo().bind( "hallodeactivated", function(event) {
    var $t = $(event.target); 
    var newAssessment = Session.get('newAssessment');  
    newAssessment.title = _.clean(_.stripTags($t.text()));
    Session.set('newAssessment',newAssessment);
  });
  $title.data('defaultText',$title.html());

  var $description = $(this.find('#description'));
  $description.hallo().bind( "hallodeactivated", function(event) {
    var $d = $(event.target); 
    var newAssessment = Session.get('newAssessment');  
    newAssessment.description = _.clean(_.stripTags($d.text()));
    Session.set('newAssessment',newAssessment);
  });
  $description.data('defaultText',$description.html());

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
    if (newAssessment && newAssessment.hasOwnProperty('_id')) {
      Meteor.call('updateActivity',newAssessment,function(error,id) {
        if (error) 
          return alert(error.reason);
        var Activity = Activities.findOne(id);
        Session.set('newAssessment',{});
        var $title = $('#title');
        $title.addClass("defaultTextActive");
        $title.text(Activity.title);

        var userToShow = Meteor.userId();
        var $description = $('#description');
        if (Activity.hasOwnProperty('description') && Activity.description) {
          $description.text(Activity.description)
        } else {
          $description.text($description.data('defaultText'));
          if (Roles.userIsInRole(userToShow,'teacher')) {
            $description.addClass('defaultTextActive');
          } else {
            $description.addClass('defaultDescriptionActive');
          };
        };
           
        $('#addAssessmentDialog').modal('hide');      
      });
    } else {
      if (userToShow) 
        newAssessment.ownerID = userToShow._id;
      Meteor.call('postActivity',newAssessment,function(error,id) {
        if (error) 
          return alert(error.reason);
        var Activity = Activities.findOne(id);
        Session.set('newAssessment',{});
        var $title = $('#title');
        $title.addClass("defaultTextActive");
        $title.text($title.data('defaultText'));

        var userToShow = Meteor.userId();
        var $description = $('#description');
        if (Activity.hasOwnProperty('description') && Activity.description) {
          $description.text(Activity.description)
        } else {
          $description.text($description.data('defaultText'));
          if (Roles.userIsInRole(userToShow,'teacher')) {
            $description.addClass('defaultTextActive');
          } else {
            $description.addClass('defaultDescriptionActive');
          };
        };

        $('#addAssessmentDialog').modal('hide');      
      });
    };
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
  'focus #description':function(event) {
    var $description = $(event.target);
    var defaultText = $description.data('defaultText');
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('_id')) {
      var Activity = Activities.findOne('newAssessment._id')
      if (Activity.hasOwnProperty('description') && Activity.description)
        defaultText = '';
    }
    if ($description.html() == defaultText) 
      $description.text("");
    $description.removeClass("defaultTextActive").removeClass("defaultDescriptionActive");
  },
  'blur #description':function(event) {
    var $description = $(event.target);
    if ($description.html() == '') {
      $description.text($description.data('defaultText'));
      var userToShow = Meteor.userId(); 
      if (Roles.userIsInRole(userToShow,'teacher')) {
        $description.addClass('defaultTextActive');
      } else {
        $description.addClass('defaultDescriptionActive');
      };
    };
  },
  'click i.remove' : function(event) {
    Session.set('newAssessment',{});
    var $title = $('#title');
    $title.addClass("defaultTextActive");
    $title.text($title.data('defaultText'));

    var $description = $('#description');
    $description.text($description.data('defaultText'));
    var userToShow = Meteor.userId(); 
    if (Roles.userIsInRole(userToShow,'teacher')) {
      $description.addClass('defaultTextActive');
    } else {
      $description.addClass('defaultDescriptionActive');
    };

    $('#addAssessmentDialog').modal('hide');
  }
});

Template.addAssessment.helpers({
  addAssessment: function() {
    var userToShow = Meteor.userId();
    if (Roles.userIsInRole(userToShow,'teacher')) {
      userToShow = Session.get('TeacherViewAs');
    }
    var newAssessment = Session.get('newAssessment');
    var titleText =  (newAssessment && newAssessment.hasOwnProperty('_id')) ? 'Edit ' : 'Add ';
    if (!Roles.userIsInRole(userToShow,['teacher','student'])) return '';
    titleText +=  (Roles.userIsInRole(userToShow,'teacher')) ? 'Assessment': 'Reassessment';
    return titleText;
  },
  standards: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('standardIDs') && newAssessment.standardIDs.length) {
      return Standards.find({_id: {$in: newAssessment.standardIDs}},
        {sort: {rank: 1}});      
    } else {
      return '';
    }
  },
  titleOrDefault: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('title'))
      return newAssessment.title;
    return 'Title (required)';
  },
  defaultTextActive: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('title'))
      return '';
    return 'defaultTextActive'; 
  },
  descriptionOrDefault: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('description') && newAssessment.description)
      return newAssessment.description;
    var userToShow = Meteor.userId();  
    if (Roles.userIsInRole(userToShow,'teacher')) {
      return 'Description (optional)'
    } else {
     return 'Explain what you will do to prepare for this reassessment, including meeting with your teacher to discuss a past assessment and which specific lab activities you will do or problems you will solve for individual practice.';
    };
  },
  defaultDescriptionActive: function() {
    var newAssessment = Session.get('newAssessment');
    if (newAssessment && newAssessment.hasOwnProperty('description') && newAssessment.description)
      return '';
    var userToShow = Meteor.userId();   
    if (Roles.userIsInRole(userToShow,'teacher')) {
      return 'defaultTextActive';
    } else {
      return 'defaultDescriptionActive'; 
    };
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
        if (newAssessment && newAssessment.hasOwnProperty('standardIDs')) {
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
      if (newAssessment && newAssessment.hasOwnProperty('standardIDs')) {
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