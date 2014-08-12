    /************************************/
   /*** Template.standardDescription ***/
  /************************************/

var defaultText = 'Provide an explanation for this standard.';

Template.standardDescription.helpers({
  description:  function() { 
    var desc = Standards.findOne(this._id).description;
    if (Roles.userIsInRole(Meteor.userId(),'teacher')) {
      return (_.clean(_.stripTags(desc))) ? desc : defaultText;
    } else {
      return (desc) ? desc : '';
    }
  },
  defaultTextActive: function() {
    var desc = Standards.findOne(this._id).description;
    return (_.clean(_.stripTags(desc))) ? '' : 'defaultTextActive';
  }
});

Template.standardDescription.events({
  'click .editDescription': function(event,tmpl) {
    var $descriptionText = $('#descriptionText');  
    var $updateButton = $(event.target).parent().parent().find('.updateDescriptionContainer');
    $descriptionText.addClass('editing'); //.addClass('defaultTextActive');
    $descriptionText.hallo(hallosettings(true)).bind( "hallodeactivated", function(event) { //hallomodified
      var standardID = $(event.target).data('standardid');
      var currentText = Standards.findOne(standardID).description;
      currentText = (_.clean(_.stripTags(currentText))) ? currentText: defaultText;
      $descriptionText.removeClass('editing'); //.addClass('defaultTextActive');
      $descriptionText.hallo({editable: false});
      $descriptionText.html(currentText);
      $updateButton.addClass('hidden');
    });
    $descriptionText.focus();
    $updateButton.removeClass('hidden');
  },
  'mousedown #updateDescription': function(event,tmpl) {
    //can't use click because have to catch this before the hallodeactivated binding
    var nS = {
      _id: $(event.target).data('standardid'),
      description: $(event.target).parent().parent().find('#descriptionText').html()
    };
    Meteor.call('updateStandard', nS,
      function(error, id) {if (error) return alert(error.reason);}
    );
  }
}); 

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