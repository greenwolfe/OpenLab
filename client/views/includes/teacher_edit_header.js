Template.teacherEditHeader.helpers({
  btnSelected : function(btn) {
  	var TEstate = Session.get('TEstate');
  	return (TEstate == btn);
  }
});