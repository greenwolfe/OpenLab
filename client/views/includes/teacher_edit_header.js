Template.teacherEditHeader.helpers({
  btnSelected : function(btn) {
  	var TEstate = Session.get('TEstate');
  	return (TEstate == btn);
  }
});

Template.teacherEditHeader.events({
  'click #btnCollapse' : function() {
  	Session.set('TEstate','collapse');
    Router.go('editCollapse');
  },
  'click #btnExpand' : function() {
  	Session.set('TEstate','expand');
  },
  'click #btnAccordion' : function() {
  	Session.set('TEstate','accordion');
    Router.go('editAccordion');
  }
});