Template.activityPage.rendered = function() {
  $(this.find('#TodoList')).sortable(SortOpt());
};

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
    console.log($('#newNote').val());
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
