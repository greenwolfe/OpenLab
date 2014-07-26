Template.accordionList.rendered = function() {
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
  }
 }); 

  /***********************************/
 /***** ACCORDION ACTIVITY ITEM  ****/
/***********************************/

Template.AccActivityItem.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("p")).hallo().bind( "hallodeactivated", function(event) {
      var nA = {
  	    _id: $(event.target).data('activityid'),
  	    title: _.clean(_.stripTags($(event.target).text()))
  	  };
  	  Meteor.call('updateActivity',nA,
  	    function(error, id) {if (error) return alert(error.reason);}
  	  );
    });
  };
}; 

var SortOpt = function () { //default sortable options

  var receive = function(event, ui) { 
    var activityID = ui.item.data('activityid');
    var oldModelID = Activities.findOne(activityID).modelID;
    var newModelID = ui.item.parent().data('modelid');
    var nA = {
      _id: activityID,
      modelID: newModelID
    };
    if (oldModelID != newModelID) {
      Meteor.call('updateActivity',nA,
        function(error, id) {if (error) return alert(error.reason);}
      );   
    }; 
    ui.item.data('received',true);
  };
  var stop = function(event, ui) { 
    var before = ui.item.prev().data('activityrank');
    var oldRank = ui.item.data('activityrank');
    var after = ui.item.next().data('activityrank');
    var activityID = ui.item.data('activityid');
    var rank = oldRank;
    var nA;
    if (!_.isNumber(before) && _.isNumber(after)) {
      rank = after - 1;
    } else if (_.isNumber(before) && !_.isNumber(after)) {
      rank = before + 1;
    } else if (_.isNumber(before) && _.isNumber(after)) {
      rank = (before + after)/2
    };
    nA = {
      _id: activityID,
      rank: rank
    };
    if (_.isNumber(oldRank) && (rank != oldRank)) {
      Meteor.call('updateActivity',nA,
        function(error, id) {if (error) return alert(error.reason);}
      );
    };
    if (ui.item.data('received')) {
      ui.item.remove(); 
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
    receive : receive,
    stop: stop,
  };

  return that;
};