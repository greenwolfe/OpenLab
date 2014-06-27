Template.activityPage.rendered = function() {
  $(this.find('#TodoList')).sortable(SortOpt());
  //$('#newNote').jqte();
  $('#newNote').hallo({
     plugins: {
      'halloformat': {'formattings': {
        "bold": true, 
        "italic": true, 
        "strikethrough": true, 
        "underline": true
       }},
       'hallojustify': {},
       'hallolists': {},
       'halloreundo': {},
       'hallolink': {}
     },
     editable: true,
     toolbar: 'halloToolbarFixed'
   });
 /*  .bind( "hallodeactivated", function(event) { //hallomodified
      console.log(event.target.id + ' modified');
      console.log(event.target.innerHTML);
   }); */
   $('#newNote').data('defaultText',$('#newNote').html());
};

Template.activityPage.helpers({
  Notes:  function() {
    return Notes.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id},{sort: {submitted: -1}});
  },
  group: function() {
    return Session.get("currentGroup") || [];
  },
  Links:  function() {
    return Links.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id});
  },
  Todos:  function() {
    return Todos.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id});
  }
});

Template.activityPage.events({
    /*********************/
   /**** Link Section ***/
  /*********************/
  'click #addLink': function(event) {
     var title = $('#LinkTitle').val();
     var URL = $('#LinkURL').val();
     if ( (title == 'Title') || (title == '') ) return;
     if ( (URL == 'URL') || (URL == '') ) return;
     var link = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : '<a href="' + URL + '">' + title + "</a>"
     }
    event.preventDefault();
    Links.insert(link,function(error) {
      if (error) alert(error.reason);
    });
    $('#LinkTitle').addClass("defaultTextActive").val('Title');
    $('#LinkURL').addClass('defaultTextActive').val('URL'); 
  },
  'focus #LinkTitle':function(event) {
    if ($('#LinkTitle').val() == 'Title') {
      $('#LinkTitle').removeClass("defaultTextActive");
      $('#LinkTitle').val("");
    };
  },
  'blur #LinkTitle':function(event) {
    if ($('#LinkTitle').val() == '') {
      $('#LinkTitle').addClass("defaultTextActive");
      $('#LinkTitle').val('Title');
    };
  },
  'focus #LinkURL':function(event) {
    if ($('#LinkURL').val() == "URL") {
      $('#LinkURL').removeClass("defaultTextActive")
                   .addClass("defaultTextInactive")
                   .val("");
    };
  },
  'blur #LinkURL':function(event) {
    if ($('#LinkURL').val() == '') {
      $('#LinkURL').removeClass("defaultTextInactive")
                   .addClass("defaultTextActive")
                   .val('URL');
    };
  },
  'click .removeLink': function(event) {
    var linkID = $(event.target).data('linkid');
    Links.remove(linkID);
   },

    /*********************/
   /**** Todo Section ***/
  /*********************/
  'click #addTodoItem': function(event) {
     var text = $('#newTodoItem').val();
     if ( (text == 'New Todo Item') || (text == '') ) return;
     var todo = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text,
      checked: false
     }
    event.preventDefault();
    Todos.insert(todo,function(error) {
      if (error) alert(error.reason);
    }); 
    $('#newTodoItem').addClass("defaultTextActive").val('New Todo Item');
  },
  'focus #newTodoItem':function(event) {
    if ($('#newTodoItem').val() == 'New Todo Item') {
      $('#newTodoItem').removeClass("defaultTextActive");
      $('#newTodoItem').val("");
    };
  },
  'blur #newTodoItem':function(event) {
    if ($('#newTodoItem').val() == '') {
      $('#newTodoItem').addClass("defaultTextActive");
      $('#newTodoItem').val('New Todo Item');
    };
  },
  'click #TodoList p input': function(event) {
    var todoID = $(event.target).val();
    var todo = Todos.findOne(todoID);
    Todos.update(todoID,{$set: {checked: !todo.checked}});
    //use meteor collection and helper to do this when collections are ready
  },
  'click .removeTodo': function(event) {
    var TodoID = $(event.target).data('todoid');
    Todos.remove(TodoID);
   }, 

    /*********************/
   /**** Note Section ***/
  /*********************/
  'click #addNote':function(event) {
    var text = $('#newNote').html();
    if ((text == $('#newNote').data('defaultText') || (text == ''))) return;
    text += _(text).endsWith('<br>') ? '':'<br>';
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text
    };   
    event.preventDefault();
    Notes.insert(note,function(error) {
      if (error) alert(error.reason);
    });
    $('#newNote').addClass("defaultTextActive");
    $('#newNote').text($('#newNote').data('defaultText'));
  },
  'focus #newNote':function(event) {
    if ($('#newNote').html() == $('#newNote').data('defaultText')) {
      $('#newNote').removeClass("defaultTextActive");
      $('#newNote').text("");
    };
  },
  'blur #newNote':function(event) {
    if ($('#newNote').html() == '') {
      $('#newNote').addClass("defaultTextActive");
      $('#newNote').text($('#newNote').data('defaultText'));
    };
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

    /*********************/
   /*** Template.todo ***/
  /*********************/

Template.todo.helpers({
  isDone:  function() {
    return this.checked ? 'done' : '';
  },
});
