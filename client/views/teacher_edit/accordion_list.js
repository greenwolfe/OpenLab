Template.accordionList.rendered = function() {
  Session.set('TEstate','accordion');
  if ($('#ListOfLists').hasClass('ui-tabs'))
    $('#ListOfLists').tabs('refresh');
};

  /***********************************/
 /*** ACCORDION ACTIVITIES LIST  ****/
/***********************************/

Template.AccActivitiesList.rendered = function() {
  $('#activities').accordion({heightStyle: "content"});
}

Template.AccActivitiesList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  }
}); 

  /***********************************/
 /** ACCORDION ACTIVITIES SUBLIST  **/
/***********************************/

var defaultText = 'Edit this text to add a new activity.'; 

Template.AccActivitiesSublist.rendered = function() {
  if ($( "#activities" ).data('ui-accordion')) //if accordion already applied
    $('#activities').accordion("refresh");
  if (Meteor.userId()) {
    $(this.find("h3")).hallo().bind( "hallodeactivated", function(event) {
      $t = $(event.target);      
      var el = $t.get(0);
      var modelID = (el) ? UI.getElementData(el)._id : NaN;
      var model = _.clean(_.stripTags($t.text()));
      var nM = {
        _id: modelID,
        model: model
      };
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
    });
  };
  $(this.find(".Model")).sortable(SortOpt());
  var model = Models.findOne(this.data._id);
  if (model && !model.visible) 
    $(this.find(".Model")).addClass('fadeout');
}; 

Template.AccActivitiesSublist.helpers({
  activities: function() {
    return Activities.find({modelID: this._id},{sort: {rank: 1}}); 
  },
  defaultText: function() {
    return defaultText;
  },
  disabled: function() {
    model = Models.findOne(this._id);
    if (model && !model.visible) return 'ui-state-disabled';
    return '';
  }
 }); 

  /***********************************/
 /***** ACCORDION ACTIVITY ITEM  ****/
/***********************************/

Template.AccActivityItem.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var title = _.clean(_.stripTags($t.text()));
      var el = $t.get(0);
      var activityID = (el) ? UI.getElementData(el)._id : NaN;
      var modelID = (el) ? UI.getElementData(el).modelID : NaN;
      var nA;
      if (activityID == -1) {
        nA = {
          title : title,
          modelID : modelID,
          description : '',
          visible: true
        };
        Meteor.call('postActivity',nA,defaultText,
          function(error, id) {if (error) return alert(error.reason);}
        );
        $t.text(defaultText);
      } else {
        nA = {
          _id: activityID,
          title: title
        };
        Meteor.call('updateActivity',nA,
          function(error, id) {if (error) return alert(error.reason);}
        );
      };
    });
  };
}; 

Template.AccActivityItem.helpers({
  disabled: function() {
    activity = Activities.findOne(this._id);
    if (activity)
      return activity.visible ? '' : 'ui-state-disabled';
    return '';
  },
  listVisible: function() {
    activity = Activities.findOne(this._id);
    if (!activity) return '';
    if (activity.visible) return 'icon-list-visible';
    return 'icon-list-hidden';    
  }
});

Template.AccActivityItem.events({
  'click i.icon-list-hidden': function() {
    activity = Activities.findOne(this._id);
    if (activity) Meteor.call('updateActivity',{_id:this._id,visible:true});
  },
  'click i.icon-list-visible': function() {
    activity = Activities.findOne(this._id);
    if (activity) Meteor.call('updateActivity',{_id:this._id,visible:false});

  }
})

var SortOpt = function () { //default sortable options

  var stop = function(event, ui) { 
    var bf = ui.item.prev().get(0);
    var before = (bf) ? UI.getElementData(bf).rank: NaN;
    var el = ui.item.get(0);
    var oldRank = (el) ? UI.getElementData(el).rank : NaN;
    var activityID = (el) ? UI.getElementData(el)._id : NaN;
    var af = ui.item.next().get(0);
    var after = (af) ? UI.getElementData(af).rank : NaN;
    var rank = oldRank;
    var nA;
    if (!_.isFinite(before) && _.isFinite(after)) {
      rank = after - 1;
    } else if (_.isFinite(before) && !_.isFinite(after)) {
      rank = before + 1;
    } else if (_.isFinite(before) && _.isFinite(after)) {
      rank = (before + after)/2
    };
    nA = {
      _id: activityID,
      rank: rank
    };
    if (_.isFinite(oldRank) && (rank != oldRank)) {
      Meteor.call('updateActivity',nA,
        function(error, id) {if (error) return alert(error.reason);}
      );
    } else {
      $(this).sortable('cancel');
    };
  };
  var that = {
    revert : false,            //smooth slide onto target
    axis: "y", //prevents dragging to another model?
    cancel: "a,p[data-activityid=-1]", //allows hallo to activate when clicking on the inner a-tag part, but dragging from out p-tag part
    forcePlaceholderSize : true,  //allows dropping on empty list
    tolerance : 'pointer',    
    placeholder : "ui-state-highlight", //yellow
    helper: 'clone', //for some reason stops click event also firing on receive when dragging event to change date
    stop: stop
  };

  return that;
};