//add a progress tab, keep it separate so it doesn't clutter the activities tab ... or is it better to do it in one?

UI.body.rendered = function () {
  $('#activities .Model p').draggable(DragOpt('.daysActivities') );
  $('#standards .Model p').draggable( DragOpt('.assessmentsStandards') );
  $('#appointments .Model p').draggable( DragOpt('.daysActivities') );
  $('#activities').accordion({heightStyle: "content"});
  $('#standards').accordion({heightStyle: "content"});
  $('#ListOfLists').tabs();
  $('.daysActivities').sortable( SortOpt('.daysActivities') ); 
  $('.assessmentsStandards').sortable(SortOpt('.assessmentsStandards') );
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

//activities dragged to calendar should
//be a hyperlink opening to a form
//with links, to-do, and comments
//meetings dragged to calendar
//should be a hyperlink opening to form
//with links, purpose, and comments

//needs edit button and form
//with links, to-do, comments
//and dates that go to calendar
//meeting to discuss last assessment
//additional practice and due date
//date of assessment

//calendar needs next and previous buttons as well as show ___ weeks slider/input box.

//procedure:  mrt add jquery-ui-bootstrap
//copy .js file from /packages/jquery-ui/lib to /client/jquery-ui-... 
//mrt remove jquery-ui
//delete link to jquery-ui directory from packages
//for some reason, meteor does not find jquery-ui when its installed
//as a package, but does find it when its copied to client
//still want jquery-ui-bootstrap, because it makes a noticeably nicer-looking
//interface, so need mrt add bootstrap as well

