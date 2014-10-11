Template.standardPage.helpers({
  LoMs: function() {
    var cU_id = Meteor.userId(); 
    var selector = {
      standardID: this._id
    };
    if (!cU_id) return '';
    if (Roles.userIsInRole(cU_id,'teacher')) {
      selector.studentID = Session.get('TeacherViewAs');
      return LevelsOfMastery.find(selector,{sort:[["submitted","desc"]]});
    } else if (Roles.userIsInRole(cU_id,'student')) {
      selector.studentID = cU_id;
      selector.visible = true;
      return LevelsOfMastery.find(selector,{sort:[["submitted","desc"]]});
    };    
  },
  LoMcolorcode: function(standard) {
    var colorcodes = ['LoMlow','LoMmedium','LoMhigh']
    var index = standard.scale.indexOf(this.level);
    return colorcodes[index];
  },
  activity: function() {
    return Activities.findOne(this.activityID);
  },
  CleanComment: function() {
    var cleanComment = _.clean(_.stripTags(this.comment));
    return cleanComment ? cleanComment: 'No teacher comment.'
  }
});

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
      return (_.clean(_.stripTags(desc))) ? desc : '';
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