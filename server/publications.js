Meteor.publish('activities',function() {
//  return Activities.find({'model':'CAPM'}, {fields: {
//    URL: false
//  }});
    return Activities.find();
});
