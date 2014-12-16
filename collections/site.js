Site = new Meteor.Collection('site');

/* Site.insert({
  title: 'Open Lab',
  dueDateBlurb: '',
  activityTypes: ['activity','assessment','reassessment','lab']
  frozen: [Dec_18_2014,Dec_19_2014,Dec_20_2014,Dec_21_2014]
}); */

var addInClassEvent = function(date,sectionID,userID) {
  var cU = Meteor.user(); //current user
  var longDate = moment(date,'MMM[_]D[_]YYYY').format('ddd[,] MMM D YYYY');
  var usersWithEvents = _.unique(_.flatten(
    CalendarEvents.find({eventDate:longDate,workplace: {$in: ['inClass','outClass']}}).map(function(cE) {
      return cE.group;
    })
  ));
  var allUsers = (userID) ? [userID] : _.compact(
    Meteor.users.find().map(function(u) { 
      if (!Roles.userIsInRole(u,'student')) return null; 
      if (!sectionID) return u._id;
      if (('profile' in u) && ('sectionID' in u.profile) && (u.profile.sectionID == sectionID))
        return u._id;
      return null;
    })
  );
  var usersWithoutEvents = _.difference(allUsers,usersWithEvents);
  var inCA = Activities.findOne({
    modelID:'wholecourse',
    title:'In class.  Attendance Required.'
  });
  var calendarEvent = {
    creator : cU._id,
    group : usersWithoutEvents,
    invite : [], 
    eventDate : longDate, //'ddd[,] MMM D YYYY'
    activityID : inCA._id,
    workplace : 'inClass'
  };
  CalendarEvents.insert(calendarEvent);
};

Meteor.methods({

  /***** POST SITE ****/
  postSite: function(site) { 
    var cU = Meteor.user(); //currentUser
    var siteId;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to alter the admin variables.");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to alter the admin variables.')
    
    if (!site.hasOwnProperty('title') || !site.title)
      throw new Meteor.Error(413, "Cannot add site variables.  Missing title.");

    if (!site.hasOwnProperty('dueDateBlurb'))
      site.dueDateBlurb = '';

    if (site.hasOwnProperty('activityTypes') && !_.isArray(site.activityTypes))
      throw new Meteor.Error(414, "Cannot add admin variables.  Activity types must be an array.")

    siteID = Site.insert(site);

    return siteID; 
  },

  /**** UPDATE SITE ****/

  /**** SITE ADD ACTIVITY TYPE ****/
  siteAddActivityType: function(newAT) {
    var cU = Meteor.user(); //currentUser
    var site = Site.findOne();

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to alter the admin variables.");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to alter the admin variables.')

    if (!newAT || !_.isString(newAt)) 
      throw new Meteor.Error(414,'Activity Type must be a string.')

    if (site.hasOwnProperty('activityTypes')) {
      Site.update(site._id,{$addToSet: {activityTypes: newAT}});
    } else {
      Site.update(site._id,{activityTypes: [newAT]});
    }

    return site._id;
  },

  /**** SITE REMOVE ACTIVITY TYPE ****/

  /**** SITE FREEZE DATES ****/
  Freeze: function(date,ID,action) { //expecting 'MMM[_]D[_]YYYY' e.g. "Dec_8_2014"
                                     //action = true => freeze
                                     //action = false => thaw
    var cU = Meteor.user(); //currentUser

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to alter the admin variables.");
    
    if (!Roles.userIsInRole(cU,'teacher'))
      throw new Meteor.Error(409, 'You must be a teacher to alter the admin variables.')

    if (!date) 
      throw new Meteor.Error(414,'No date passed to freeze.')
    if (!moment(date,'MMM[_]D[_]YYYY').isValid())
      throw new Meteor.Error(415,'Cannot freeze invalid date.');


    var student = Meteor.users.findOne(ID);
    var section = Sections.findOne(ID);
    var site = Site.findOne();
    var day;
    if (student && Roles.userIsInRole(student,'teacher')) {  //freeze at site level 
      if (('frozen' in site)) { 
        if (action) { 
          Site.update(site._id,{ $addToSet: { frozen: date } });
        } else {
          Site.update(site._id,{ $pull: {frozen: date}});
        }
      } else if (action) {
        Site.update(site._id,{$set: {frozen: [date]}});
      }
      Sections.update({},{$pull: {frozen: {date:date}}},{multi:true}); //clear sections
      Meteor.users.update({},{$pull: {frozen: {date:date}}},{multi:true}); //clear users
      if (action) addInClassEvent(date,null,null);
    } else if (section) { //freeze at section level
      if (('frozen' in section)) {
        day = _.find(section.frozen,function(f) {return (f.date == date)});
        if (day) {
          Sections.update({_id:ID,"frozen.date":date},{$set:{"frozen.$.frozen":action}});
        } else {
          Sections.update(ID,{$addToSet: {frozen: {date:date,frozen:action}  }});
        }
      } else {
        Sections.update(ID,{$set: {frozen: [{date:date,frozen:action}] }});
      }
      Meteor.users.update({"profile.sectionID":ID},{$pull: {frozen: {date:date}}},{multi:true}); //clear users
      if (action) addInClassEvent(date,ID,null);
    } else if (student && Roles.userIsInRole(student,'student')) {  //freeze at individual student level
      if (('frozen' in student)) {
        day = _.find(student.frozen,function(f) {return (f.date == date)});
        if (day) {
          Meteor.users.update({_id:ID,"frozen.date":date},{$set:{"frozen.$.frozen":action}});
        } else {
          Meteor.users.update(ID,{$addToSet: {frozen: {date:date,frozen:action}  }});
        }
      } else {
        Meteor.users.update(ID,{$set: {frozen: [{date:date,frozen:action}] }});
      }
      if (action) addInClassEvent(date,null,ID);
    };




    //check all users and dates, if section meets that day, 
    //and user does not have calendar event,
    //add default in class event


    return site._id;
  }

});