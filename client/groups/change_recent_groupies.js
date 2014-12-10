Template.changeGroupies.events({
  'click i.remove' : function(event) {
    $('#changeGroupiesDialog').modal('hide');
    //also return selections to defaults if not changing group?
    $('#joinGroupDialog').modal();
  }
});