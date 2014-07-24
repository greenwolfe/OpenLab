  /**************************************/
 /*** TEACHER EDIT ACTIVITIES LIST  ****/
/**************************************/

Template.TEactivitiesList.rendered = function() {
  $('#activities').accordion({heightStyle: "content"});
} 

Template.TEactivitiesList.helpers({
  models: function() {
    return Models.find({},{sort: {rank: 1}});
  }
}); 

  /**************************************/
 /** TEACHER EDIT ACTIVITIES SUBLIST  **/
/******************************S********/

Template.TEactivitiesSublist.rendered = function() {
  if ($( "#activities" ).data('ui-accordion')) //if accordion already applied
    $('#activities').accordion("refresh");
}; 

Template.TEactivitiesSublist.helpers({
  activities: function() {
    return Activities.find({modelID: this._id},{sort: {rank: 1}}); 
  }
 }); 

  /**************************************/
 /***** TEACHER EDIT ACTIVITY ITEM  ****/
/**************************************/

Template.TEactivityItem.rendered = function() {
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