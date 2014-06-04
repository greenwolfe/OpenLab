Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { return Meteor.subscribe('activities'); }
});

Router.map(function() {
  this.route('studentView', {path: '/'});
});

Router.onBeforeAction('loading');
