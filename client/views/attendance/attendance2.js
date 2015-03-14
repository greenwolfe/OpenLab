  /***************************/
 /***** ATTENDANCE 2 ********/
/***************************/

Template.attendance2.helpers({
  weekday: function() {
    return {ID:Session.get('attendanceDate')};
  },
  attendanceDate: function() {
    return moment(Session.get('attendanceDate'),'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
  },
  sections: function() {
    var TVA = Session.get('TeacherViewAs');
    var sectionIDs = Sections.find().fetch().map(function(s) { return s._id })
    if (_.contains(sectionIDs,TVA)) {
      return Sections.find(TVA);
    } else {
      var student = Meteor.users.findOne(TVA);
      if ((student) && ('profile' in student) && ('sectionID' in student.profile)) 
        if (_.contains(sectionIDs,student.profile.sectionID)) 
          return Sections.find(student.profile.sectionID)
    }
    return Sections.find();
  },
  groupsInClass: function() {
    var TVA = Session.get('TeacherViewAs');
    var students = Meteor.users.find({'profile.sectionID':this._id}).fetch();
    var groups = [];
    var alreadyChosen = [];
    students.forEach(function(student) {
      if (_.contains(alreadyChosen,student._id))  return;
      alreadyChosen = alreadyChosen.concat(student._id);
      var group = [student];
      if (('profile' in student) && ('recentGroupies' in student.profile)) {
        student.profile.recentGroupies.forEach(function(groupie) {
          if (_.contains(alreadyChosen,groupie))  return;
          alreadyChosen = alreadyChosen.concat(groupie);
          group = group.concat(Meteor.users.findOne(groupie));
        })
      }
      groups.push({'students': group});
    });
    return groups;
  }
});

Template.attendance2.events({
  'click #previousDay': function() {
    var day = moment(Session.get('attendanceDate'),'MMM[_]D[_]YYYY')
    day.add('days',-1)
    Session.set('attendanceDate',day.format('MMM[_]D[_]YYYY'));
  },
  'click #nextDay': function() {
    var day = moment(Session.get('attendanceDate'),'MMM[_]D[_]YYYY')
    day.add('days',1)
    Session.set('attendanceDate',day.format('MMM[_]D[_]YYYY'));
  }
});

  /**********************************/
 /***** GROUPS ATTENDANCE 2 ********/
/**********************************/

Template.groupsAttendance2.helpers({
  present: function() {
    var date = Session.get('attendanceDate');    
    var att = Attendance.findOne({date:date,sectionID:this.profile.sectionID});
    if (!att) return '';
    return (_.contains(att.presence,this._id)) ? 'present' : '';
  },
  inClass: function() {
    var date = moment(Session.get('attendanceDate'),'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
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
  fullname: function() {
    if (('profile' in this) && ('firstName' in this.profile) && ('lastName' in this.profile))
      return this.profile.firstName + ' ' + this.profile.lastName;
    return this.username;
  },
  allPresent: function() {
    var date = Session.get('attendanceDate');
    var group = this.students.map(function(s) { return s._id});
    var sampleStudent = this.students[0];
    var sectionID = sampleStudent.profile.sectionID;    
    var att = Attendance.findOne({date:date,sectionID:sectionID});
    if (!att) return 'All Present';
    return (_.intersection(att.presence,group).length == group.length) ? 'All Absent' : 'All Present';    
  }
});

Template.groupsAttendance2.events({
  'click .attendanceName': function(event) { 
      var userID = this._id;
      var date = Session.get('attendanceDate');
      var sectionID = this.profile.sectionID;
      Meteor.call('togglePresence',date,sectionID,[userID]);
  },
  'click .attendanceToggleGroup': function(event) { 
    var date = Session.get('attendanceDate');
    var group = this.students.map(function(s) { return s._id});
    var sampleStudent = this.students[0];
    var sectionID = sampleStudent.profile.sectionID;
    var action = $(event.target).text();
    Meteor.call('markPresent',date,sectionID,group,(action == 'All Present'));
  }
});

