Template.activityPage.rendered = function() {
  $(this.find('#TodoList')).sortable(SortOpt());
  $('#newNote').hallo(hallosettings(true));
 /*  .bind( "hallodeactivated", function(event) { //hallomodified
      console.log(event.target.id + ' modified');
      console.log(event.target.innerHTML);
   }); */
   //will have to be moved, as here it isn't reactive if group changes
   $('#newNote').data('defaultText',$('#newNote').html());
};

Template.activityPage.helpers({
  Notes:  function() {
    var userID = Meteor.userId();
    var userToShow = Session.get('TeacherViewIDs');
    if (Roles.userIsInRole(userID,'teacher')) {
      if (_.contains(userToShow,userID))
        return Notes.find({
          activityID: this._id,
          $or:[ 
            {author:userID}, 
            {group: {$in: userToShow}} 
          ]},
          {sort: {submitted: -1}});
    };
    return Notes.find({group: {$in: userToShow},activityID: this._id},{sort: {submitted: -1}});
  },
  group: function() {
    return Session.get("currentGroup") || [];
  },
  Links:  function() {
    var userToShow = Session.get('TeacherViewIDs');
    return Links.find({group: {$in: userToShow},activityID: this._id});
  },
  Todos:  function() {
    var userToShow = Session.get('TeacherViewIDs');
    return Todos.find({group: {$in: userToShow},activityID: this._id});
  }
});

Template.activityPage.events({
    /*********************/
   /**** Link Section ***/
  /*********************/
  'click #addLink': function(event) {
     var title = $('#LinkTitle').val();
     var URL = $('#LinkURL').val();
     var group = Session.get("currentGroup") || [];
     var hoverText = UI._globalHelper('groupies')("belongs to just ","belongs to ",group,"","");
    var link = {
      author : Meteor.userId(),
      group : group,
      submitted : new Date().getTime(),
      activityID : this._id,
      title: title, 
      URL: URL,
      hoverText: hoverText
    }
    event.preventDefault();
    Meteor.call('postLink', link, 
      function(error, id) {if (error) return alert(error.reason);}
    );
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
    Meteor.call('deleteLink', linkID, 
      function(error, id) {if (error) return alert(error.reason);}
    );
   },

    /*********************/
   /**** Todo Section ***/
  /*********************/
  'click #addTodoItem': function(event) {
     var text = $('#newTodoItem').val();
     var todo = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text,
      checked: false
    }
    event.preventDefault();
    Meteor.call('postTodo', todo, 
      function(error, id) {if (error) return alert(error.reason);}
    );
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
    Meteor.call('toggleTodo', todoID, 
      function(error, id) {if (error) return alert(error.reason);}
    );
  },
  'click .removeTodo': function(event) {
    var TodoID = $(event.target).data('todoid');
    Meteor.call('deleteTodo', TodoID, 
      function(error, id) {if (error) return alert(error.reason);}
    );
   }, 

    /*********************/
   /**** Note Section ***/
  /*********************/
  'click #addNote':function(event) {
    var text = $('#newNote').html();
    var note = {
      author : Meteor.userId(),
      group : Session.get("currentGroup") || [],
      submitted : new Date().getTime(),
      activityID : this._id,
      text : text
    };   
    event.preventDefault();
    Meteor.call('postNote', note, $('#newNote').data('defaultText'),
      function(error, id) {if (error) return alert(error.reason);}
    );    
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
  },
  'click .removeNote': function(event) {
    var NoteID = $(event.target).data('noteid');
    Meteor.call('deleteNote', NoteID, 
      function(error, id) {if (error) return alert(error.reason);}
    );
   },
   'click .editNote': function(event,tmpl) {
      var $noteText = $(event.target).parent().parent().find('.noteText');
      var $updateButton = $(event.target).parent().parent().find('.updateNoteContainer');
      $noteText.addClass('editing');
      $noteText.hallo(hallosettings(true)).bind( "hallodeactivated", function(event) { //hallomodified
        var noteID = $(event.target).data('noteid');
        var currentText = Notes.findOne(noteID).text;
        $noteText.removeClass('editing');
        $noteText.hallo({editable: false});
        $noteText.html(currentText);
        $updateButton.addClass('hidden');
      });
      $noteText.focus();
      $updateButton.removeClass('hidden');
    },
    'mousedown .updateNote': function(event,tmpl) {
      //can't use click because have to catch this before the hallodeactivated binding
      var newText = $(event.target).parent().parent().find('.noteText').html();
      var noteID = $(event.target).data('noteid');
      Meteor.call('updateNote', noteID, newText,
        function(error, id) {if (error) return alert(error.reason);}
      );
    }
});

    /****************************/
   /*** Template.description ***/
  /****************************/

var defaultText = 'Provide a description of this activity.';

Template.description.helpers({
  description:  function() { 
    var desc = Activities.findOne(this._id).description;
    console.log(desc);
    if (Roles.userIsInRole(Meteor.userId(),'teacher')) {
      return (_.clean(_.stripTags(desc))) ? desc : defaultText;
    } else {
      return (desc) ? desc : '';
    }
  },
  defaultTextActive: function() {
    var desc = Activities.findOne(this._id).description;
    return (_.clean(_.stripTags(desc))) ? '' : 'defaultTextActive';
  }
});

Template.description.events({
  'click .editDescription': function(event,tmpl) {
    var $descriptionText = $('#descriptionText');   
    var $updateButton = $(event.target).parent().parent().find('.updateDescriptionContainer');
    $descriptionText.addClass('editing').addClass('defaultTextActive');
    $descriptionText.hallo(hallosettings(true)).bind( "hallodeactivated", function(event) { //hallomodified
      var activityID = $(event.target).data('activityid');
      var currentText = Activities.findOne(activityID).description;
      currentText = (_.clean(_.stripTags(currentText))) ? currentText: defaultText;
      $descriptionText.removeClass('editing').addClass('defaultTextActive');
      $descriptionText.hallo({editable: false});
      $descriptionText.html(currentText);
      $updateButton.addClass('hidden');
    });
    $descriptionText.focus();
    $updateButton.removeClass('hidden');
  },
  'mousedown #updateDescription': function(event,tmpl) {
    //can't use click because have to catch this before the hallodeactivated binding
    var nA = {
      _id: $(event.target).data('activityid'),
      description: $(event.target).parent().parent().find('#descriptionText').html()
    };
    Meteor.call('updateActivity', nA,
      function(error, id) {if (error) return alert(error.reason);}
    );
  }
}); 



    /*********************/
   /*** Template.todo ***/
  /*********************/

Template.todo.helpers({
  isDone:  function() {
    return this.checked ? 'done' : '';
  },
  isChecked: function() {
    return this.checked ? 'checked' : '';
  }
});

    /*********************/
   /*** Template.note ***/
  /*********************/

Template.note.helpers({
  allowDelete: function() {
    var userID = Meteor.userId();
    var now, editDeadline;
    if (!userID) return false;
    if (Roles.userIsInRole(userID,'teacher')) return true;
    if (!Roles.userIsInRole(userID,'student')) return false;
    if (!this.author || (userID != this.author)) return false;
    now = moment();
    editDeadline = moment(this.submitted).add('minutes',30);
    return (editDeadline.isAfter(now));
  },
  allowEdit: function() {
    var userID = Meteor.userId();
    var now, editDeadline;
    if (!userID) return false;
    if (!Roles.userIsInRole(userID,['student','teacher'])) return false;
    if (!this.author || (userID != this.author)) return false;
    now = moment();
    editDeadline = moment(this.submitted).add('minutes',30);
    return (Roles.userIsInRole(userID,'teacher') || editDeadline.isAfter(now));
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

var hallosettings = function(editable) {
  var that =  {
   plugins: {
     'halloformat' : {'formattings': {
       "bold": true, 
       "italic": true, 
       "strikethrough": true, 
       "underline": true
     }},
     'hallojustify' : {},
     'hallolists': {},
     'halloreundo': {},
     'hallolink': {}
   },
   editable: editable,
   toolbar: 'halloToolbarFixed'
 };

 return that;
};
