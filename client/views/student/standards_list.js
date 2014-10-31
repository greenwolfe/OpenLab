  /************************/
 /*** STANDARDS LIST  ****/
/************************/

Template.standardsList.rendered = function() {
  $('#standards').accordion({heightStyle: "content"});
}

Template.standardsList.helpers({
  models: function() {
    return Models.find({visible:true},{sort: {rank: 1}});
  },
  standardsWtihNoModel: function() {
    return Standards.find({visible:true,modelID:null},{sort: {rank:1}});
  }
});

  /************************/
 /** STANDARDS SUBLIST  **/
/************************/

Template.standardsSublist.rendered = function() {
  if ($( "#standards" ).data('ui-accordion')) //if accordion already applied
    $('#standards').accordion("refresh");
};

Template.standardsSublist.helpers({
  standards: function() {
    return Standards.find({modelID: this._id, visible: true},{sort: {rank: 1}}); 
  },
  standardsMastered: function() {
    if (this.modelID == 'wholecourse') return '';
    var standards = Standards.find({modelID: this._id, visible: true}).fetch();
    var Mcount = 0;
    var LoMcount = 0;
    standards.forEach(function(st) {
      if (st.LoM) {
        var index;
        if (_.isArray(st.scale)) {
          index = st.scale.indexOf(st.LoM);
          if (index == st.scale.length - 1) Mcount += 1;
        }
        if (_.isFinite(st.scale)) {
          index = Math.floor(st.LoM*3/st.scale);
          if (index >= 2) Mcount += 1;
        }
        LoMcount += 1;
      }
    });
    return ' (' + Mcount + '/' + LoMcount + '/' + standards.length + ')';
  }
});

  /*************************/
 /***** STANDARD ITEM  ****/
/*************************/

Template.standardItem.rendered = function() {
  $(this.find("p")).draggable(DragOpt('') );
};

Template.standardItem.events({
  'click a': function(event) {
    var TVA;
    var currentUserID = Meteor.userId();
    if (currentUserID && Roles.userIsInRole(currentUserID,'teacher')) {
       TVA = Session.get('TeacherViewAs');
       if (Meteor.user(TVA) || Sections.findOne(TVA)) {
        Session.set('currentGroup',[TVA]);
      };
    } else {
      Session.set('currentGroup',[Meteor.userId()]);
    };
  }
});

Template.standardItem.helpers({
  plaindescription: function() {
    return _.stripTags(this.description);
  },
  LoMcolorcode: function() {
    var colorcodes = ['LoMlow','LoMmedium','LoMhigh']
    var index;
    if (_.isArray(this.scale)) {
      index = this.scale.indexOf(this.LoM);
    }
    if (_.isFinite(this.scale)) {
      index = Math.floor(this.LoM*3/this.scale);
      index = Math.min(index,2);
    }
    return colorcodes[index];
  },
  LoMtext: function() {
    if (_.isArray(this.scale))
      return this.LoM;
    return this.LoM + ' out of ' + this.scale;
  }
});

var DragOpt = function (sortable) { //default draggable options
  var pos_fixed = 1;
  var start = function(event,ui) {
    pos_fixed = 0;
  };
  var drag = function(event,ui) { //corrects bug where scrolling of main window displaces helper from mouse
    if (pos_fixed == 0) {
      $(ui.helper).css('margin-top',$(event.target).offset().top - $(ui.helper).offset().top);
      pos_fixed = 1;
    };
  };
  var stop = function (event, ui) {  // so it can't be modified from outside
    $('.placeholder').remove();  //remove all placeholders on the page
  };

  var that = {                  
    connectToSortable : sortable,  //drag target
    appendTo : "body",  //allows dragging out of frame to new object
    helper : "clone",   
    revert : "invalid",  //glide back into place if not dropped on target
    start : start,
    drag : drag,
    stop : stop
  };

  return that;
};

