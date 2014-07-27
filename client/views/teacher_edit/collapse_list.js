 Template.collapseList.rendered = function() {
  Session.set('TEstate','collapse');
  if ($('#ListOfLists').hasClass('ui-tabs'))
    $('#ListOfLists').tabs('refresh');
 };

  /***********************************/
 /*** COLLAPSE ACTIVITIES LIST  ****/
/***********************************/

Template.ColActivitiesList.rendered = function() {
  $('#activities').sortable(SortOpt());
};

Template.ColActivitiesList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  }
}); 

Template.ColActivitiesSublist.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var nM = {
        _id: $(event.target).data('modelid'),
        model: _.clean(_.stripTags($(event.target).text()))
      };
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
    });
  };
}

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

//careful using this ... must be edited for standards!
Template.ColStandardsSublist.rendered = function() {
  if (Meteor.userId()) {
    $(this.find("a")).hallo().bind( "hallodeactivated", function(event) {
      var nM = {
        _id: $(event.target).data('modelid'),
        model: _.clean(_.stripTags($(event.target).text()))
      };
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
    });
  };
}

var SortOpt = function () { //default sortable options

  var stop = function(event, ui) { 
    var before = ui.item.prev().data('modelrank');
    var oldRank = ui.item.data('modelrank');
    var after = ui.item.next().data('modelrank');
    var modelID = ui.item.data('modelid');
    var rank = oldRank;
    var nM;
    if (!_.isNumber(before) && _.isNumber(after)) {
      rank = after - 1;
    } else if (_.isNumber(before) && !_.isNumber(after)) {
      rank = before + 1;
    } else if (_.isNumber(before) && _.isNumber(after)) {
      rank = (before + after)/2
    };
    nM = {
      _id: modelID,
      rank: rank
    };
    if (_.isNumber(oldRank) && (rank != oldRank)) {
      Meteor.call('updateModel',nM,
        function(error, id) {if (error) return alert(error.reason);}
      );
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