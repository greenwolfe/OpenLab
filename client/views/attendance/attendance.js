      //enable show and clickoff by group
      //allow selecting date

  /*************************/
 /***** ATTENDANCE ********/
/*************************/

Template.attendance.helpers({
	attendanceDate: function() {
		return moment(Session.get('attendanceDate'),'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
	},
	sectionID: function() {
		var TVA = Session.get('TeacherViewAs');
		var userToShow = Meteor.users.findOne(TVA);
		var sectionToShow = Sections.findOne(TVA);
		if (sectionToShow)
			return sectionToShow._id;
		if (!userToShow || Roles.userIsInRole(userToShow,'teacher'))
			return '';
        if (!userToShow.hasOwnProperty('profile') || !userToShow.profile.hasOwnProperty('sectionID'))
        	return '';
        sectionToShow = Sections.findOne(userToShow.profile.sectionID);
        if (!sectionToShow)
        	return '';
        return sectionToShow._id;
	},
	section: function() {
		var sectionID = Template.attendance.sectionID();
		if (sectionID)
			return Sections.findOne(sectionID).section;
		return '';
	},
	students: function() {
		var sectionID = Template.attendance.sectionID();
		return Meteor.users.find({'profile.sectionID':sectionID},{sort: [['profile.lastName','asc'],['profile.firstName','asc']]});
	},
  groupsInClass: function() {
    var date = Template.attendance.attendanceDate();
    var sectionID = Template.attendance.sectionID();
    var teacherViewIDs = Meteor.users.find({'profile.sectionID': sectionID}).map(function(u) {return u._id}); 
    var calendarEvents;
    if (teacherViewIDs) {
      calendarEvents =  CalendarEvents.find({group: {$in: teacherViewIDs}, 
        eventDate: date, workplace:'inClass'}).fetch();
      return calendarEvents.filter(function (cE) {
        var activity = Activities.findOne(cE.activityID);
        if (!activity) return false;
        var model = Models.findOne(activity.modelID);
        if (!model) return false;
        return (activity.visible && model.visible);
      });
    }
    return '';
  }
});

  /**********************************/
 /***** ATTENDANCE  STUDENT ********/
/**********************************/

Template.attendanceStudent.helpers({
  status: function() {
  	var date = Template.attendance.attendanceDate();
    var sectionID = (this.hasOwnProperty('profile') && 
      this.profile.hasOwnProperty('sectionID')) ? this.profile.sectionID : '';
    var inClassCount = CalendarEvents.find({group: {$in: [this._id,sectionID,'_All_']}, 
        workplace: {$in: ['inClass']},
        eventDate: date}).count();
  	var outClassCount = CalendarEvents.find({group: {$in: [this._id,sectionID,'_All_']}, 
        workplace: {$in: ['outClass']},
        eventDate: date}).count();
    if (inClassCount) {
    	return 'in class';
    } else if (outClassCount) {
    	return 'out of class';
    } else {
    	return 'unverified, expected in class';
    }
  },
  inClass: function() {
  	var date = Template.attendance.attendanceDate();
  	var inClassCount = CalendarEvents.find({group: {$in: [this._id]}, 
        workplace: {$in: ['inClass']},
        eventDate: date}).count();
  	 var outClassCount = CalendarEvents.find({group: {$in: [this._id]}, 
        workplace: {$in: ['outClass']},
        eventDate: date}).count();
    if (inClassCount) {
    	return 'inClass';
    } else if (outClassCount) {
    	return 'outClass';
    } else {
    	return 'inClass'; //unverified, but don't want a line to sign for them
    }
  },
  present: function() {
    var date = Session.get('attendanceDate');
    var sectionID = Template.attendance.sectionID();    
    var att = Attendance.findOne({date:date,sectionID:sectionID});
    if (!att) return '';
    return (_.contains(att.presence,this._id)) ? 'present' : '';
  }
});

Template.attendanceStudent.events({
	'click .attendanceName': function(event) { 
      var $aName = $(event.target);
      var userID = $aName.data('userid');
      var date = Session.get('attendanceDate');
      var sectionID = Template.attendance.sectionID();
      Meteor.call('togglePresence',date,sectionID,[userID]);
	}
});

  /*****************************************/
 /***** ATTENDANCE  GROUP In CLASS ********/
/*****************************************/

Template.attendanceGroupInClass.helpers({
  studentsInGroup: function() {
    return Meteor.users.find({_id: {$in: this.group}});
  },
  allPresent: function() {
    var date = Session.get('attendanceDate');
    var sectionID = Template.attendance.sectionID();    
    var att = Attendance.findOne({date:date,sectionID:sectionID});
    if (!att) return 'All Present';
    return (_.intersection(att.presence,this.group).length == this.group.length) ? 'All Absent' : 'All Present';    
  }
});

Template.attendanceGroupInClass.events({
  'click .attendanceToggleGroup': function(event) { 
      var date = Session.get('attendanceDate');
      var sectionID = Template.attendance.sectionID();
      var action = $(event.target).text();
      Meteor.call('markPresent',date,sectionID,this.group,(action == 'All Present'));
  }
});

  /*****************************************/
 /***** ATTENDANCE STUDENT IN GROUP *******/
/*****************************************/

Template.attendanceStudentInGroup.helpers({
  present: function() {
    var date = Session.get('attendanceDate');
    var sectionID = Template.attendance.sectionID();    
    var att = Attendance.findOne({date:date,sectionID:sectionID});
    if (!att) return '';
    return (_.contains(att.presence,this._id)) ? 'present' : '';
  }
});

Template.attendanceStudentInGroup.events({
  'click .attendanceName': function(event) { 
      var $aName = $(event.target);
      var userID = $aName.data('userid');
      var date = Session.get('attendanceDate');
      var sectionID = Template.attendance.sectionID();
      Meteor.call('togglePresence',date,sectionID,[userID]);
  }
});