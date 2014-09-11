Template.studentView.helpers({
  counters: function() {  //add dismiss button and record state in user profile
                      //put help button in main toolbar to reveal again
    return "Dr. Greenwolfe's students have made ___ comments on wiki pages. You have completed ___ of them."
  },
  reminder: function() {
    return "Counters for wiki pages, high-quality comments, and PGA coming soon and will then be parts of your first PGA grade. <br/> <ul> <li>Make two high-quality comments on position graph wikis. </li>  <li> Claim and make a wiki page for velocity graphs. </li> <li> Make sure your wiki pages have a PGA block. </li> <li> Leave a personal PGA comment for one velocity activity and one position activity in openlab. </li></ul> "
  }
});
//Template.studentView.rendered = function () {
  //$('#appointments .Model p').draggable( DragOpt('.daysActivities') );
  //$('#ListOfLists').tabs(); 
//};

/*var DragOpt = function (sortable) { //default draggable options

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
}; */