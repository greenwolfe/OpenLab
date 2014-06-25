Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    return [
      Meteor.subscribe('activities'),
      Meteor.subscribe('calendarEvents',Meteor.userId()), 
      Meteor.subscribe('userList'),
      Meteor.subscribe('links',Meteor.userId()),
      Meteor.subscribe('notes',Meteor.userId()),
      Meteor.subscribe('todos',Meteor.userId())
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
});

/*var requireLogin = function() {
  if (! Meteor.user()) {
    Router.go('/');
  }
}; */

Router.onBeforeAction('loading');
//Router.onBeforeAction(requireLogin);
