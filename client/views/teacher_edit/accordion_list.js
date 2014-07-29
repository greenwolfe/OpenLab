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
      var nM = {
        _id: $(event.target).data('modelid'),
        model: _.clean(_.stripTags($(event.target).text()))
      };
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
    });
  };
  $(this.find(".Model")).sortable(SortOpt());
}; 

Template.AccActivitiesSublist.helpers({
  activities: function() {
    return Activities.find({modelID: this._id},{sort: {rank: 1}}); 
  },
  defaultText: function() {
    return defaultText;
  }
 }); 

  /***********************************/
 /***** ACCORDION ACTIVITY ITEM  ****/
/***********************************/

Template.AccActivityItem.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var $t = $(event.target);
      var activityID = $t.data('activityid');
      var title = _.clean(_.stripTags($t.text()));
      var rank = $t.parent().prev().data('activityrank') + 1;
      var modelID = $t.parent().parent().data('modelid');
      var nA;
      if (activityID == -1) {
        nA = {
          title : title,
          modelID : modelID,
          description : '',
          rank : rank,
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
  }
});

var SortOpt = function () { //default sortable options

  var stop = function(event, ui) { 
    var before = ui.item.prev().data('activityrank');
    var oldRank = ui.item.data('activityrank');
    var after = ui.item.next().data('activityrank');
    var activityID = ui.item.data('activityid');
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
      window.location.reload();  //surely there must be a way to reload just the part needed!!
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