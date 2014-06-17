Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    return [
      Meteor.subscribe('activities'),
      Meteor.subscribe('calendarEvents', Meteor.userId()),
      Meteor.subscribe('userList')
    ];
  }
});

Router.map(function() {
  this.route('studentView', {
    path: '/',
    yieldTemplates: {
      'header': {to: 'header'}
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

Router.onBeforeAction('loading');
