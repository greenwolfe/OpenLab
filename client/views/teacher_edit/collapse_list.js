 Template.collapseList.rendered = function() {
  Session.set('TEstate','collapse');
  if ($('#ListOfLists').hasClass('ui-tabs'))
    $('#ListOfLists').tabs('refresh');
 };

  /**********************************/
 /*** COLLAPSE ACTIVITIES LIST  ****/
/**********************************/

var defaultText = 'Edit this text to add a new unit/model.'

Template.ColActivitiesList.rendered = function() {
  $('#activities').sortable(SortOpt());
};

Template.ColActivitiesList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  },
  defaultText: function() {
    return defaultText;
  }
}); 

  /*************************************/
 /*** COLLAPSE ACTIVITIES SUBLIST  ****/
/*************************************/

Template.ColActivitiesSublist.rendered = function() {
  if (Meteor.userId()) {
    $(this.find(".mName")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var el = $t.get(0);
      var modelID = (el) ? UI.getElementData(el)._id : NaN;
      var model = _.clean(_.stripTags($t.text()));
      var nM;      
      if (modelID == -1) {
        nM = {
            model : model,
            longname : 'model',
            description : '',
            visible: true
        }
        Meteor.call('postModel',nM,defaultText,
          function(error, id) {if (error) return alert(error.reason);}
        );
        $t.text(defaultText);
      } else {
        nM = {
          _id: modelID,
          model: model
        };
        Meteor.call('updateModel',nM,
          function(error, id) {if (error) return alert(error.reason);}
        );
      }
    });
    $(this.find(".lName")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var el = $t.get(0);
      var modelID = (el) ? UI.getElementData(el)._id : NaN;
      var longname = _.clean(_.stripTags($t.text()));
      var model = (el) ? UI.getElementData(el).model : defaultText;
      var nM;      
      if (modelID == -1) {
        nM = {
            model: model,
            longname : longname,
            description : '',
            visible: true
        }
        Meteor.call('postModel',nM,defaultText,
          function(error, id) {if (error) return alert(error.reason);}
        );
        $t.text(defaultText);
      } else {
        nM = {
          _id: modelID,
          model: model,
          longname: longname
        };
        Meteor.call('updateModel',nM,
          function(error, id) {if (error) return alert(error.reason);}
        );
      }
    });
  };
}

Template.ColActivitiesSublist.helpers({
  disabled: function() {
    model = Models.findOne(this._id);
    if (model && !model.visible) return 'ui-state-disabled';
    return '';
  },
  listVisible: function() {
    model = Models.findOne(this._id);
    if (!model) return '';
    if (model.visible) return 'icon-list-visible';
    return 'icon-list-hidden';    
  }
});

Template.ColActivitiesSublist.events({
  'click i.icon-list-hidden': function() {
    model = Models.findOne(this._id);
    if (model) Meteor.call('updateModel',{_id:this._id,visible:true});
  },
  'click i.icon-list-visible': function() {
    model = Models.findOne(this._id);
    if (model) Meteor.call('updateModel',{_id:this._id,visible:false});
  }
})



  /*********************************/
 /*** COLLAPSE STANDARDS LIST  ****/
/*********************************/

Template.ColStandardsList.rendered = function() {
  $('#standards').sortable(SortOpt());
}

Template.ColStandardsList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  }
}); 


var SortOpt = function () { //default sortable options
  var stop = function(event, ui) { 
    var bf = ui.item.prev().get(0);
    var before = (bf) ? UI.getElementData(bf).rank: NaN;
    var el = ui.item.get(0);
    var oldRank = (el) ? UI.getElementData(el).rank : NaN;
    var modelID = (el) ? UI.getElementData(el)._id : NaN;
    var af = ui.item.next().get(0);
    var after = (af) ? UI.getElementData(af).rank : NaN;
    var rank = oldRank;
    var nM;
    if (!_.isFinite(before) && _.isFinite(after)) {
      rank = after - 1;
    } else if (_.isFinite(before) && !_.isFinite(after)) {
      rank = before + 1;
    } else if (_.isFinite(before) && _.isFinite(after)) {
      rank = (before + after)/2
    };
    nM = {
      _id: modelID,
      rank: rank
    };
    if (_.isFinite(oldRank) && (rank != oldRank)) {
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
    } else {
      $(this).sortable('cancel');
    };
  };
  var that = {
    revert : false,            //smooth slide onto target
    axis: "y", //prevents dragging to another model?
    cancel: "a", //allows hallo to activate when clicking on the inner a-tag part, but dragging from out p-tag part
    forcePlaceholderSize : true,  //allows dropping on empty list
    tolerance : 'pointer',    
    placeholder : "ui-state-highlight", //yellow
    helper: 'clone', //for some reason stops click event also firing on receive when dragging event to change date
    stop: stop
  };

  return that;
};