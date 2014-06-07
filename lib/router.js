Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    return [
      Meteor.subscribe('activities'),
      Meteor.subscribe('calendarEvents')
    ];
  }
});

Router.map(function() {
  this.route('studentView', {path: '/'});

  this.route('activityPage', {
    path: '/activity/:_id',
    data: function() { return Activities.findOne(this.params._id); }
  });
});

Router.onBeforeAction('loading');
