var standardsData = [
  {
    title : 'Position Graphs',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Velocity Graphs',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : 'Acceleration Graphs',
    URL : '#',
    model : 'CAPM'
  },
  {
    title : "Newton's First Law",
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Weight vs. Mass',
    URL : '#',
    model : 'BFPM'
  },
  {
    title : 'Vector Addition 2 (Force)',
    URL : '#',
    model : 'BFPM'
  }
]

Template.standardsList.helpers({
  models: function() {
    return Models.find();
  }
});

Template.standardsSublist.helpers({
  standards: function() {
                var model = this.model;
                return $.grep(standardsData, function(a) { return a.model == model })
              }
});
