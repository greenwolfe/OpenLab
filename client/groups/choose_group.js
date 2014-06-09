Template.chooseGroup.rendered = function() {
  $('#chooseGroupDialog').dialog(DialogOpt());
};

var DialogOpt = function() {
  var that = {
    autoOpen : false,
    modal : true,
    buttons: {
      Save : function() {
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    }
  };
  return that;
};
