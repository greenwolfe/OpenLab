  /********************/
 /*** ASSESSMENT  ****/
/********************/

Template.assessment.rendered = function() {
  $('.assessment').droppable(dropOpt());
  Deps.autorun(function() {
    console.log('currentAssessment changed, in autorun');
    var cA = Session.get('currentAssessment');
    if (!!cA) {
      $( ".assessment" ).droppable( "option", "accept", ".assessmentAct, .assessmentStand" );
    } else {
      $(".assessment").droppable("option","accept",".assessmentAct");
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

var dropOpt = function () { //droppable options
  var activate = function(event,ui) {
    $(this).addClass('ui-state-default');
  };
  var over = function (event, ui) {
    $(this).switchClass('ui-state-default','ui-state-highlight');
  };
  var out = function(event,ui) {
    $(this).switchClass('ui-state-highlight','ui-state-default');
  };
  var deactivate = function(event,ui) {
    $(this).removeClass('ui-state-default');
  };
  var drop = function(event, ui) {
    $(this).removeClass('ui-state-highlight');
    var elData = UI.getElementData(ui.draggable.get(0));
    console.log(elData);
    var Activity = Activities.findOne(elData._id);
    console.log(Activity);
    console.log(!!Activity);
    var Standard = Standards.findOne(elData._id);
    console.log(Standard);
    console.log(!!Standard);
    if (!!Activity) {
      Session.set('currentAssessment',Activity);
    } else if (!!Standard) {
      Activity = Session.get('currentAssessment');
      console.log(Activity._id);
      console.log(Standard._id);
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

