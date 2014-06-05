var MonThisWeek = moment().day("Monday").format('ddd[,] MMM D YYYY');
var MonNextWeek = moment().day("Monday").add('weeks',1).format('ddd[,] MMM D YYYY');
Session.setDefault('calStartDate',MonThisWeek);
Session.setDefault('calEndDate',MonNextWeek);
var startDate = Session.get('calStartDate');
var endDate = moment(Session.get('calEndDate'),'ddd[,] MMM D YYYY').day("Friday").format('ddd[,] MMM D YYYY');
//Session does not keep calendar dates if browse away and back?
//Is this because default is reset or because it's not kept in the
//first place, triggering the default values to be reset?

Template.studentView.rendered = function () {
  $('#standards .Model p').draggable( DragOpt('.assessmentsStandards') );
  $('#appointments .Model p').draggable( DragOpt('.daysActivities') );
  $('#activities').accordion({heightStyle: "content"});
  $('#standards').accordion({heightStyle: "content"});
  $('#ListOfLists').tabs(); 
  $('.assessmentsStandards').sortable(SortOpt('.assessmentsStandards') );
  $('#startDate').datepicker(DateOpt('calStartDate')).datepicker('setDate', startDate);
  $('#endDate').datepicker(DateOpt('calEndDate')).datepicker('setDate', endDate);
};

var DateOpt = function(sessionKey) { //default datepicker options
  var onSelect = function(dateText,Object){
    Monday = moment(dateText,'ddd[,] MMM D YYYY').day("Monday");
    Monday = Monday.format('ddd[,] MMM D YYYY');
    if (!Session.equals(sessionKey,Monday)) {
      Session.set(sessionKey,Monday);
    };
  };
  var that = {
    dateFormat:'D, M dd yy',
    onSelect: onSelect
  };
  return that;
};

var DragOpt = function (sortable) { //default draggable options

  var stop = function (event, ui) {  // so it can't be modified from outside
    $('.placeholder').remove();  //remove all placeholders on the page
  };

  var that = {                  
    connectToSortable : sortable,  //drag target
    appendTo : "body",  //allows dragging out of frame to new object
    helper : "clone",   //leave the original behind
    revert : "invalid",  //glide back into place if not dropped on target
    stop : stop
  };

  return that;
};

var SortOpt = function (connector) { //default sortable options

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
    var day = moment(event.target.id); //activity dropped on date, replace with handler
  }

  var that = {
    connectWith : connector,  //connect with other lists
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

