  /************************/
 /*** STANDARDS LIST  ****/
/************************/

Template.standardsList.rendered = function() {
  $('#standards').accordion({heightStyle: "content"});
}

Template.standardsList.helpers({
  models: function() {
    return Models.find({visible:true},{sort: {rank: 1}});
  }
});

  /************************/
 /** STANDARDS SUBLIST  **/
/************************/

Template.standardsSublist.rendered = function() {
  if ($( "#standards" ).data('ui-accordion')) //if accordion already applied
    $('#standards').accordion("refresh");
};

Template.standardsSublist.helpers({
  standards: function() {
    return Standards.find({modelID: this._id, visible: true},{sort: {rank: 1}}); 
  }
});

  /*************************/
 /***** STANDARD ITEM  ****/
/*************************/

Template.standardItem.rendered = function() {
  $(this.find("p")).draggable(DragOpt('') );
};

Template.standardItem.events({
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

