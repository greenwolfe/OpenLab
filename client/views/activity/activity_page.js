Template.activityPage.rendered = function() {
  $(this.find('#TodoList')).sortable(SortOpt());
  $('#newNote').hallo(); /*{
    plugins: {
    'halloformat': {}
   }
  });*/ //$('#newNote').jqte();
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
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : $('#newNote').val()
    };   
    event.preventDefault();
    Notes.insert(note);
    $('#newNote').val(''); //$('#newNote').jqteVal('');
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
