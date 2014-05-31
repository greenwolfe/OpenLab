Template.calendarDay.rendered = function() {
  var id = '#' + this.find('.daysActivities').id;
  $(id).sortable( SortOpt('.daysActivities') );
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

