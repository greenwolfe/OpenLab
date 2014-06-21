Template.activityPage.rendered = function() {
  $(this.find('#TodoList')).sortable(SortOpt());
  //$('#newNote').jqte();
  $('#newNote').hallo({
     plugins: {
      'halloformat': {"bold": true, "italic": true, "strikethrough": true, "underline": true}
     },
     editable: true,
     toolbar: 'halloToolbarFixed'
   })
   .bind( "hallodeactivated", function(event) { //hallomodified
      console.log(event.target.id + ' modified');
      console.log(event.target.innerHTML);
   });
};

Template.activityPage.helpers({
  Notes:  function() {
    return Notes.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id});
  },
  group: function() {
    return Session.get("currentGroup") || [];
  }
});

Template.activityPage.events({
  'click #TodoList p': function(event) {
    var todoItem = event.target.parentElement;
    if (event.target.checked) {
      $(event.target.parentElement).addClass('done');
    } else {
      $(event.target.parentElement).removeClass('done');
    };
    //do this with meteor collection and helper when collections are ready
  },
  'click #addTodoItem': function(event) {
    console.log($('#newTodoItem').val());
  },
  'click #newLink': function(event) {
     console.log('pop up new link modal');
  },
  'click #addNote':function(event) {
    var text = $('#newNote').hallo()[0].innerHTML;
    var d = text.length - 4;
    text += ((d >= 0) && (text.indexOf('<br>',d) === d)) ? '':'<br>';
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text
    };   
    event.preventDefault();
    Notes.insert(note);
    $('#newNote').text('initial text');
  }
});

var SortOpt = function() {
  var that = {
    revert : false,            //smooth slide onto target
    tolerance : 'pointer',    
    axis: "y"
  };

  return that;
};
