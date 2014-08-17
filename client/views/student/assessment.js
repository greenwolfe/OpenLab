  /********************/
 /*** ASSESSMENT  ****/
/********************/

Template.assessment.rendered = function() {
  $('.assessment').droppable(dropOpt());
  Deps.autorun(function() {
    var cA = Session.get('currentAssessment');
    if (!!cA) {
      $( ".assessment" ).droppable( "option", "accept", ".assessmentAct, .assessmentStand, .assessmentsStandards p" );
    } else {
      $(".assessment").droppable("option","accept",".assessmentAct, .assessmentsStandards p");
    };
  });
  //$('.assessmentsStandards').sortable(SortOpt() );
}

Template.assessment.helpers({
  isCurrentAssessment: function() {
    var cA = Session.get('currentAssessment');
    return !!cA;
  },
  currentAssessment: function() {
    var cA = Session.get('currentAssessment');
    return cA;
  },
  standards: function() {
    var cA = Session.get('currentAssessment');
    if (cA && cA.hasOwnProperty('standardIDs') && cA.standardIDs.length) {
      return Standards.find({_id: {$in: cA.standardIDs}});      
    } else {
      return '';
    }
  }
});

Template.assessment.events({
  'click #showAssessmentList': function() {
    Session.set('currentAssessment','');
  }
});

  /**********************************/
 /**** ASSESSMENT STANDARD ITEM ****/
/**********************************/

Template.assessmentStandardItem.rendered = function() {
  $(this.find('p')).draggable(dragOpt());
};

var dragOpt = function() { //draggable options
  var that = {
    distance: 10,
    revert: 'valid'
  };

  return that;
};

var dropOpt = function () { //droppable options
  var activate = function(event,ui) {
    if (!ui.draggable.hasClass('aSItem'))
      $(this).addClass('ui-state-default');
  };
  var over = function (event, ui) {
    if (!ui.draggable.hasClass('aSItem'))
      $(this).switchClass('ui-state-default','ui-state-highlight',0);
  };
  var out = function(event,ui) {
    if (!ui.draggable.hasClass('aSItem'))
      $(this).switchClass('ui-state-highlight','ui-state-default',0);
  };
  var deactivate = function(event,ui) { //called after drop
    $(this).removeClass('ui-state-default ui-state-highlight');
    if (ui.draggable.hasClass('aSItem')) {
      if (ui.draggable.hasClass('aSItemDropped')) {
        ui.draggable.removeClass('aSItemDropped');
      } else {
        var Standard = UI.getElementData(ui.helper.get(0));
        var Activity = Session.get('currentAssessment');
        Meteor.call('activityRemoveStandard',Activity._id,Standard._id);
        Session.set('currentAssessment',Activities.findOne(Activity._id));
      };
    };
  };
  var drop = function(event, ui) {
    if (ui.draggable.hasClass('aSItem')) { //returned to list, so don't delete it
      ui.draggable.addClass('aSItemDropped'); 
    };
    var elData = UI.getElementData(ui.draggable.get(0));
    var Activity = Activities.findOne(elData._id);
    var Standard = Standards.findOne(elData._id);
    if (!!Activity) {
      Session.set('currentAssessment',Activity);
    } else if (!!Standard) {
      Activity = Session.get('currentAssessment');
      Meteor.call('activityAddStandard',Activity._id,Standard._id);
      Session.set('currentAssessment',Activities.findOne(Activity._id));
    }; 
  };

  var that = {
    accept: '.assessmentAct',
    activate: activate,
    over: over,
    out: out,
    deactivate: deactivate,
    drop: drop
  };

  return that;
}

var SortOpt = function () { //default sortable options

  var activate = function(event, ui) {  //puts placeholders on all targets
    $( this).prepend($('<p class="ui-state-default placeholder">.</p>'));
    $(ui.sender).find('.placeholder').hide(); //except for the sortable it was dragged from
  };
  var over = function(event, ui) { //shows placeholders on all other targets
    $('.placeholder').show();
    $(this).find('.placeholder').hide();
  };
  var stop = function(event, ui) {  //removes all placeholders on page
    $( '.placeholder').remove();
  };
  var receive = function(event, ui) {  //ditto
    $( '.placeholder').remove();
  };

  var that = {
    revert : true,            //smooth slide onto target
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

