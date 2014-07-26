Template.teacherEdit.rendered = function () {
  $('#ListOfLists').tabs(); 
  $('.assessment').addClass('fadeout');
  $('#startEndDates').addClass('fadeout');
  $('#calendar').addClass('fadeout');
};

Template.teacherEdit.helpers({
  info: function() {  //add dismiss button and record state in user profile
  	                  //put help button in main toolbar to reveal again
    var TEstate = Session.get('TEstate');
    if (TEstate == 'accordion') return 'Just click and start writing to edit text. &nbsp;&nbsp;&nbsp;&nbsp;Click outside edited text to save changes.  &nbsp;&nbsp;&nbsp;&nbsp;Use the Esc key to cancel. &nbsp;&nbsp;&nbsp;&nbsp;Drag items within any list to reorder.';
    if (TEstate == 'collapse') return 'Just click and start writing to edit text. &nbsp;&nbsp;&nbsp;&nbsp;Drag items within any list to reorder.';
    if (TEstate == 'expand') return 'Just click and start writing to edit text. &nbsp;&nbsp;&nbsp;&nbsp;Drag items from one list to another (or within any list) to reorder.';
    return '';
  }
});

