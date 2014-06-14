Template.openInvite.helpers({
  group : function() {
    return _.without( this.invite.concat(this.group), Meteor.userId() );
  }
});

