Template.teacherEditHeader.helpers({
  btnSelected : function(btn) {
  	var TEstate = Session.get('TEstate');
  	return (TEstate == btn);
  }
});

Template.teacherEditHeader.events({
  'click #btnCollapse' : function() {
  	Session.set('TEstate','collapse');
  },
  'click #btnExpand' : function() {
  	Session.set('TEstate','expand');
  },
  'click #btnAccordion' : function() {
  	Session.set('TEstate','accordion');
  }
});