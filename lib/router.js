Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    return [
      Meteor.subscribe('activities'),
      Meteor.subscribe('calendarEvents',Meteor.userId()), //currently limited at publication level to just those of current user
      Meteor.subscribe('userList'),
      Meteor.subscribe('links',Meteor.userId()) //currently limited at publication level to just those of current user
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

Router.onBeforeAction('loading');
