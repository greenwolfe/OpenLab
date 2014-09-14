Attendance = new Meteor.Collection('attendance');

/*  var att = {
      date: date, //'MMM[_]D[_]YYYY'
      sectionID: sectionID,
      presence: [userID1,userID2,userID2]
    } */

Meteor.methods({

  /***** TOGGLE PRESENCE ****/

	togglePresence: function(date,sectionID,userIDs) { 
	  var cU = Meteor.user(); //currentUser
	  var section = Sections.findOne(sectionID);
	  var att, attID; 

	  if (!cU)  
	    throw new Meteor.Error(401, "You must be logged in to take attendance");

	  if (!Roles.userIsInRole(cU,'teacher'))
	    throw new Meteor.Error(402, "Only a teacher can take attendance.");

	  if (!section) 
	    throw new Meteor.Error(470, "Cannot take attendance.  Invalid section.")

	  if (!date || !moment(date,'MMM[_]D[_]YYYY',true).isValid())
	    throw new Meteor.Error(411, "Cannot take attendance.  Invalid date");

	  att = Attendance.findOne({date: date,sectionID:sectionID});

	  userIDs.forEach(function(userID) {
	    var user = Meteor.users.findOne(userID);
	    if (!user)
	      throw new Meteor.Error(402, "Cannot take attendance.  Invalid student.  ID: " + userID);
	  }); 

	  if (!att) {
	    att = {
	      date: date,
	      sectionID: sectionID,
	      presence: userIDs
	    };
	    att._id = Attendance.insert(att);
	  } else {
		  userIDs.forEach(function(userID) {
		    if (_.contains(att.presence,userID)) {
		      Attendance.update(att._id,{$pull: {presence: userID}});
		    } else {
		     Attendance.update(att._id,{$addToSet: {presence: userID}});
		    };
	    });
    }
  },

  /***** MARK PRESENT *****/

  markPresent: function(date,sectionID,userIDs,present) { 
    var cU = Meteor.user(); //currentUser
    var section = Sections.findOne(sectionID);
    var att, attID; 

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to take attendance");

    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(402, "Only a teacher can take attendance.");

    if (!section) 
      throw new Meteor.Error(470, "Cannot take attendance.  Invalid section.")

    if (!date || !moment(date,'MMM[_]D[_]YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot take attendance.  Invalid date");

    att = Attendance.findOne({date: date,sectionID:sectionID});

    userIDs.forEach(function(userID) {
      var user = Meteor.users.findOne(userID);
      if (!user)
        throw new Meteor.Error(402, "Cannot take attendance.  Invalid student.  ID: " + userID);
    }); 

    if (!att) {
      att = {
        date: date,
        sectionID: sectionID,
        presence: userIDs
      };
      att._id = Attendance.insert(att);
    } else {
      userIDs.forEach(function(userID) {
        if (present) {
          Attendance.update(att._id,{$addToSet: {presence: userID}});
        } else {
         Attendance.update(att._id,{$pull: {presence: userID}});
        };
      });
    }
  }
}); 
