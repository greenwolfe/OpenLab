  /************************/
 /*** STANDARDS LIST  ****/
/************************/

Template.standardsList.helpers({
  models: function() {
    return Models.find({visible:true},{sort: {rank: 1}});
  },
  activeCategory: function() {
    var activeCategory = Session.get('activeCategory');
    if (!activeCategory) return {
      _id: null,
      model: '  ',
      longname: '  '
    }
    if (activeCategory == 'wholecourse') {
      var wholecourse = {
        _id: 'wholecourse',
        model: 'whole course',
        longname: "Standards that aren't specific to a particular model."
      }
      return wholecourse;
    }
    return Models.findOne(activeCategory);
  },
  rabbits: function() {
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!!rabbits & (rabbits.length > 0))
      return rabbits[0].username + "'s";
    return 'expected';
  }
});

  /*************************/
 /** CATEGORY TITLE      **/
/*************************/

Template.categoryTitle.helpers({
  active: function() {
    var activeCategory = Session.get('activeCategory');
    if (!activeCategory) {
      var categories = Models.find({visible:true},{sort: {rank: 1}}).fetch();
      var cU = Meteor.user();
      activeCategory = categories[0]._id;
      if (cU && ('profile' in cU) && ('lastOpened' in cU.profile) && 
        ('studentStandardList' in cU.profile.lastOpened) && 
        ((cU.profile.lastOpened.studentStandardList == 'wholecourse') ||
        Models.findOne(cU.profile.lastOpened.studentStandardList))) 
          activeCategory = cU.profile.lastOpened.studentStandardList;
      Session.set('activeCategory', activeCategory);
    }
    return (this._id == activeCategory) ? 'active' : '';
  },
  percentExpected: function() {
    var standards = Standards.find({modelID: this._id, visible: true}).fetch();
    var Mcount = 0;
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!rabbits || (rabbits.length == 0))
      return 0;
    var rabbit = rabbits[0];
    if (rabbit.hasOwnProperty('LoMs')) {
      standards.forEach(function(st) {
        var LoM = _.findWhere(rabbit.LoMs,{standardID:st._id});
        if (LoM) {
          var index;
          if (_.isArray(st.scale)) {
            index = st.scale.indexOf(LoM.level);
            if (index == st.scale.length - 1) Mcount += 1;
          }
          if (_.isFinite(st.scale)) {
            index = Math.floor(LoM.level*3/st.scale);
            if (index >= 2) Mcount += 1;
          }
        }
      });
    };
    return Mcount*100/standards.length;
  },
  percentCompleted: function() {
    var standards = Standards.find({modelID: this._id, visible: true}).fetch();
    var Mcount = 0;
    var student = Meteor.userId(); //could be teacher
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    if (student && student.hasOwnProperty('LoMs')) {
      standards.forEach(function(st) {
        var LoM = _.findWhere(student.LoMs,{standardID:st._id});
        if (LoM) {
          var index;
          if (_.isArray(st.scale)) {
            index = st.scale.indexOf(LoM.level);
            if (index == st.scale.length - 1) Mcount += 1;
          }
          if (_.isFinite(st.scale)) {
            index = Math.floor(LoM.level*3/st.scale);
            if (index >= 2) Mcount += 1;
          }
        }
      });
    };
    return Mcount*100/standards.length;
  }
});

Template.categoryTitle.events({
  'click li a': function(event,tmpl) {
    event.preventDefault();
    Session.set('activeCategory',tmpl.data._id);
    var cU = Meteor.user();
    if (cU && ('profile' in cU)) {
      Meteor.users.update({_id:cU._id}, { $set:{"profile.lastOpened.studentStandardList":tmpl.data._id} });
    }
  }
})



  /************************/
 /** STANDARDS SUBLIST  **/
/************************/

Template.standardsSublist.helpers({
  standards: function() {
    return Standards.find({modelID: this._id, visible: true},{sort: {rank: 1}}); 
  },
  standardsMastered: function() {
    if (this.modelID == 'wholecourse') return ''; //??? does this do anything ??
    var standards = Standards.find({modelID: this._id, visible: true}).fetch();
    var Mcount = 0;
    var LoMcount = 0;
    var student = Meteor.userId(); //could be teacher
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    if (student && student.hasOwnProperty('LoMs')) {
      standards.forEach(function(st) {
        var LoM = _.findWhere(student.LoMs,{standardID:st._id});
        if (LoM) {
          var index;
          if (_.isArray(st.scale)) {
            index = st.scale.indexOf(LoM.level);
            if (index == st.scale.length - 1) Mcount += 1;
          }
          if (_.isFinite(st.scale)) {
            index = Math.floor(LoM.level*3/st.scale);
            if (index >= 2) Mcount += 1;
          }
          LoMcount += 1;
        }
      });
    };
    return ' (' + Mcount + '/' + LoMcount + '/' + standards.length + ')';
  }
});

  /*************************/
 /***** STANDARD ITEM  ****/
/*************************/

Template.standardItem.rendered = function() {
  var $standard = $(this.find("p")); 
  if ($(this.find("p")).closest('#assessment').length) { 
    //if is in create assessment modal dialog and further is in assessment box to be added to the assessment
    $standard.draggable({
      distance: 10,
      revert: 'valid', //don't slide back into place when dropped
      start: function(event,ui) {
        ui.helper.addClass('draggingOut');
      }
      /*start: function(event,ui) {
        ui.addClass('draggedOut');
      } */
    });
  } else {
    $standard.draggable(DragOpt('') );
  };
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
/*  LoMcolorcode: function() {
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
  }, */
  LoMcolorcodeNew: function() { //assumes hasLoMnew checked in html
    var colorcodes = ['LoMlow','LoMmedium','LoMhigh']
    var index;
    var student = Meteor.userId(); //could be teacher
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    var LoM = _.findWhere(student.LoMs,{standardID:this._id});
    if (_.isArray(this.scale)) {
      index = this.scale.indexOf(LoM.level);
    }
    if (_.isFinite(this.scale)) {
      index = Math.floor(LoM.level*3/this.scale);
      index = Math.min(index,2);
    }
    return colorcodes[index];    
  },
  hasLoMnew: function() {
    var student = Meteor.userId(); //could be teacher
    var LoM = null;
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    if (student && student.hasOwnProperty('LoMs'))
      LoM = _.findWhere(student.LoMs,{standardID:this._id});
    return !!LoM;
  },
  LoMtextNew: function() { //assumes hasLoMnew checked in html
    var student = Meteor.userId(); //could be teacher
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    var LoM = _.findWhere(student.LoMs,{standardID:this._id});  
    if (_.isArray(this.scale))
      return LoM.level;
    return LoM.level + ' out of ' + this.scale;      
  },
  expected: function() {
    var rabbits = Roles.getUsersInRole('rabbit').fetch();
    if (!rabbits || (rabbits.length == 0)) return '';
    var rabbit = rabbits[0];
    if (rabbit.hasOwnProperty('LoMs')) {
      var LoM = _.findWhere(rabbit.LoMs,{standardID:this._id});
      if (LoM) {
        var index;
        if (_.isArray(this.scale)) {
          index = this.scale.indexOf(LoM.level);
          if (index == this.scale.length - 1) return 'expected';
        }
        if (_.isFinite(this.scale)) {
          index = Math.floor(LoM.level*3/this.scale);
          if (index >= 2) return 'expected';
        }
      }
    }
    return '';
  },
  completed: function() {
    var student = Meteor.userId(); //could be teacher
    if (Roles.userIsInRole(student,'teacher')) {
      student = Session.get('TeacherViewAs');
    };
    student = Meteor.users.findOne(student);
    if (!student) return '';
    if (student.hasOwnProperty('LoMs')) {
      var LoM = _.findWhere(student.LoMs,{standardID:this._id});
      if (LoM) {
        var index;
        if (_.isArray(this.scale)) {
          index = this.scale.indexOf(LoM.level);
          if (index == this.scale.length - 1) return 'completed';
        }
        if (_.isFinite(this.scale)) {
          index = Math.floor(LoM.level*3/this.scale);
          if (index >= 2) return 'completed';
        }
      }
    }
    return '';
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
    //connectToSortable : sortable,  //drag target
    appendTo : "#addAssessmentDialog",  //allows dragging out of frame to new object
    helper : "clone",   
    revert : "invalid",  //glide back into place if not dropped on target
    //start : start,
    //drag : drag,
    //stop : stop
  };

  return that;
};

