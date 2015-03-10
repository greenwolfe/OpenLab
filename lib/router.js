Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    var currentUser = Meteor.user();
    var userToShow = ['_ALL_'];
    var recentGroupies = []; 
    if (currentUser) {
      userToShow.push(currentUser._id);
      if (currentUser.profile && currentUser.profile.sectionID)
        userToShow.push(currentUser.profile.sectionID);
      if (('profile' in currentUser) && ('recentGroupies' in currentUser.profile))
        recentGroupies = _.union(userToShow,currentUser.profile.recentGroupies);
    }
    return [
      Meteor.subscribe('site'),
      Meteor.subscribe('gradesAndStatus',Meteor.userId()),
      Meteor.subscribe('userList'),
      Meteor.subscribe('rabbit'),
      Meteor.subscribe('activities',Meteor.userId()), 
      Meteor.subscribe('sections'),
      Meteor.subscribe('models',false),
      Meteor.subscribe('standards',Meteor.userId()),
      Meteor.subscribe('links',userToShow),
      Meteor.subscribe('notes',userToShow),
      Meteor.subscribe('todos',userToShow),
      Meteor.subscribe('calendarEvents',recentGroupies),
      Meteor.subscribe('levelsOfMastery',Meteor.userId()),
      Meteor.subscribe('postGameAnalyses',Meteor.userId())
    ];
  }
});

Router.map(function() {
  this.route('studentView', {
    path: '/',
    yieldTemplates: {
      'studentHeader': {to: 'header'}
    }
  });

  this.route('activityPage', {
    path: '/activity/:_id',
    data: function() { return Activities.findOne(this.params._id); },
    yieldTemplates: {
      'activityHeader': {to: 'header'}
    },
    onBeforeAction: function() {
      if (Meteor.isClient) {
        Session.set('LomFilterA','ThisAssessment');
        Session.set('LomFilterT','MostRecent');
      }
    },
    waitOn: function() {
      var TVA = null;
      if (Meteor.isClient) TVA = Session.get('TeacherViewAs');
      if (TVA) Meteor.subscribe('gradesAndStatus',TVA);
    }
    //,
/*    onBeforeAction: function() {
      var activity = Activities.findOne(this.params._id);
      if (activity) {
        var model = Models.findOne(activity.modelID)
        if (model) {
          if (!activity.visible || !model.visible) 
            Router.go('studentView');
        } else {
          Router.go('studentView');
        }
      } else {
        Router.go('studentView')
      };
    }*/
  });

  this.route('standardPage', {
    path: '/standard/:_id',
    data: function() { return Standards.findOne(this.params._id); },
    yieldTemplates: {
      'standardHeader': {to: 'header'}
    }
  });

  this.route('attendance', {
    path: '/attendance/:ID',
    yieldTemplates: {
      'attendanceHeader': {to: 'header'}
    },
    onBeforeAction: function () {
      var currentUser = Meteor.user();
      if (!currentUser || !Roles.userIsInRole(currentUser,'teacher')) 
        Router.go('studentView');
      if (Meteor.isClient) {
        Session.set('attendanceDate',this.params.ID);
      }
    }
  });

  this.route('editAccordion', {
    template: 'teacherEdit',
    path: '/edit_accordion',
    yieldTemplates: {
      'teacherEditHeader': {to: 'header'},
      'accordionList': {to: 'lists'}
    },
    onBeforeAction: function () {
      var currentUser = Meteor.user();
      if (!currentUser || !Roles.userIsInRole(currentUser,'teacher')) 
        Router.go('studentView');
    }
  });

  this.route('editCollapse', {
    template: 'teacherEdit',
    path: '/edit_collapse',
    yieldTemplates: {
      'teacherEditHeader': {to: 'header'},
      'collapseList': {to: 'lists'}
    },
    onBeforeAction: function () {
      var currentUser = Meteor.user();
      if (!currentUser || !Roles.userIsInRole(currentUser,'teacher')) 
        Router.go('studentView');
    }
  });

  this.route('editExpand', {
    template: 'teacherEdit',
    path: '/edit_expand',
    yieldTemplates: {
      'teacherEditHeader': {to: 'header'},
      'expandList': {to: 'lists'}
    },
    onBeforeAction: function () {
      var currentUser = Meteor.user();
      if (!currentUser || !Roles.userIsInRole(currentUser,'teacher')) 
        Router.go('studentView');
    }
  });
});

/*var requireLogin = function() {
  if (! Meteor.user()) {
    Router.go('/');
  }
}; */

Router.onBeforeAction('loading');
//Router.onBeforeAction(requireLogin);
