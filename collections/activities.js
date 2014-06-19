Activities = new Meteor.Collection('activities');

if (Activities.find().count() === 0) {
  Activities.insert({
    title : 'Acceleration Intro',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Problem-solving with the Velocity Graph',
    model : 'CAPM'
  }); 

  Activities.insert({
    title : 'Olympic Event - Designer Ramp',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Model Summary',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Olympic Event - Hole in One',
    model : 'CAPM'
  });

  Activities.insert({
    title : 'Broom Ball Review',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Force Diagrams for Stationary Objects',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Force Diagrams for Moving Objects',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Weight vs. Mass Lab',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Statics with Horizontal and Vertical Forces',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Statics with Forces at Angles',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Olympic Event - Stuffed Animals',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Dueling Forces',
    model : 'BFPM'
  });

  Activities.insert({
    title : 'Model Summary',
    model : 'BFPM'
  });
};
