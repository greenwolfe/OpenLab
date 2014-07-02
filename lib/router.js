Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { 
    return [
      Meteor.subscribe('userList'),
      Meteor.subscribe('activities'),
      Meteor.subscribe('links',[Meteor.userId(),'_ALL_']),
      Meteor.subscribe('notes',[Meteor.userId(),'_ALL_']),
      Meteor.subscribe('todos',[Meteor.userId(),'_ALL_']),
      Meteor.subscribe('calendarEvents',[Meteor.userId(),'_ALL_'])
    ];
  }
});

Router.map(function() {
  this.route('studentView', {
    path: '/',
    yieldTemplates: {
      'studentHeader': {to: 'header'}
    }//,
//    waitOn: function () { 
//      return [
//        
//      ];
//    }  //played with putting subscriptions here insteadof in main router.configure, but was creating difficulties, so put them all back, may need to return to this issue if it begins to take a long time to load at first (so want to push some loading to individual pages rather than load all initially) or for security reasons
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
