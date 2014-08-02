Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    var currentUser = Meteor.user();
    var userToShow = ['_ALL_'];
    if (currentUser) {
      userToShow.push(currentUser._id);
      if (currentUser.profile && currentUser.profile.sectionID)
        userToShow.push(currentUser.profile.sectionID);
    }
    return [
      Meteor.subscribe('userList'),
      Meteor.subscribe('activities',false),
      Meteor.subscribe('sections'),
      Meteor.subscribe('models',false),
      Meteor.subscribe('links',userToShow),
      Meteor.subscribe('notes',userToShow),
      Meteor.subscribe('todos',userToShow),
      Meteor.subscribe('calendarEvents',userToShow)
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
    }
  });

  this.route('editAccordion', {
    template: 'teacherEdit',
    path: '/edit_accordion',
    yieldTemplates: {
      'teacherEditHeader': {to: 'header'},
      'accordionList': {to: 'lists'}
    },
    onBeforeAction: function (pause) {
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
    onBeforeAction: function (pause) {
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
    onBeforeAction: function (pause) {
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
