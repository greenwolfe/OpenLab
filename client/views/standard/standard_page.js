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
    var index;
    if (_.isArray(standard.scale)) {
      index = standard.scale.indexOf(this.level);
    }
    if (_.isFinite(standard.scale)) {
      index = Math.floor(this.level*3/standard.scale);
      index = Math.min(index,2);
    }
    return colorcodes[index];
  },
  LoMtext: function(standard) {
    if (_.isArray(standard.scale))
      return this.level;
    return this.level + ' out of ' + standard.scale;
  },
  activity: function() {
    return Activities.findOne(this.activityID);
  },
  CleanComment: function() {
    var cleanComment = _.clean(_.stripTags(this.comment));
    return cleanComment ? cleanComment: 'No teacher comment.'
  },
  assessmentName: function() {
    var activity = Activities.findOne(this.activityID);
    if (activity) return activity.title;
    return '';
  }
});

    /************************************/
   /*** Template.standardDescription ***/
  /************************************/

var defaultText = 'Provide an explanation for this standard.';

Template.standardDescription.rendered = function() {
  var cU = Meteor.userId();
  if (Roles.userIsInRole(cU,'teacher')) {
    $('#scaleText').hallo().bind("hallodeactivated",function(event) {
      var $t = $(event.target);
      var scale = $t.text();
      if (scale.indexOf(',') > -1) {
        scale = scale.replace(/\s+/g, '');
        scale = scale.split(',');
      } else if (parseFloat(scale)) {
        scale = parseFloat(scale);
      } else {
        return;
      }
      var el = $t.get(0);
      var standardID = (el) ? UI.getElementData(el)._id : NaN;
      var nS = {
        _id: standardID,
        scale: scale
      };
      Meteor.call('updateStandard', nS,
        function(error, id) {if (error) return alert(error.reason);}
      );
    });
  };
};

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
  },
  scaleText: function() {
    if (_.isFinite(this.scale)) return this.scale;
    return this.scale.join(", ");
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