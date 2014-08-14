  /********************/
 /*** ASSESSMENT  ****/
/********************/

Template.assessment.rendered = function() {
  $('.assessment').droppable(dropOpt());
  //$('.assessmentsStandards').sortable(SortOpt() );
}

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
    var Activity = UI.getElementData(ui.draggable.get(0))
    Session.set('currentAssessment',Activity);    
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

