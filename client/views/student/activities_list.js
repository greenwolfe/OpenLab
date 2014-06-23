  /*************************/
 /*** ACTIVITIES LIST  ****/
/*************************/

var models = [
 {model: 'CAPM'},
 {model: 'BFPM'}
]
Template.activitiesList.helpers({
  models: models
  
});

  /*************************/
 /** ACTIVITIES SUBLIST  **/
/*************************/


Template.activitiesSublist.helpers({
  activities: function() {
    return Activities.find({model: this.model}); 
  }
});


  /*************************/
 /***** ACTIVITY ITEM  ****/
/*************************/

Template.activityItem.rendered = function() {
  $(this.find("p")).draggable(DragOpt('.daysActivities') );
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
    helper : "clone",   //leave the original behind
    revert : "invalid",  //glide back into place if not dropped on target
    start : start,
    drag : drag,
    stop : stop
  };

  return that;
};

Template.activityItem.events({
  'click a': function(event) {
    Session.set('currentGroup',[Meteor.userId()]);
  }
});
