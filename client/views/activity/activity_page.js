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
    return Notes.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id});
  },
  group: function() {
    return Session.get("currentGroup") || [];
  },
  Links:  function() {
    return Links.find({group: {$in: [Meteor.userId(),'_ALL_']},activityID: this._id});
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
    //use meteor collection and helper to do this when collections are ready
  },
  'click #addTodoItem': function(event) {
    console.log($('#newTodoItem').val());
  },
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
