var activitiesData = [
  {
    title : 'Acceleration Intro',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Problem-solving with the Velocity Graph',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Olympic Event - Designer Ramp',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Position Graphs, Acceleration Graphs and Motion Maps',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Model Summary',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Olympic Event - Hole in One',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Broom Ball Review',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Force Diagrams for Stationary Objects',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Force Diagrams for Moving Objects',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Weight vs. Mass Lab',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Statics with Horizontal and Vertical Forces',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Statics with Forces at Angles',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Olympic Event - Stuffed Animals',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Dueling Forces',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Model Summary',
    URL : '#',
    model : 'BFPM'
  }
]

Template.activitiesSublist.helpers({
  activities: function() {
                var model = this.model;
                return $.grep(activitiesData, function(a) { return a.model == model })
              }
});
