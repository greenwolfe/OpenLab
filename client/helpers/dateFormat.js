var dateFormat = function (date,L) {
  if (L == 'short') {
   return moment(date).format('ddd[,] MMM D');
  } else if (L == 'datetime') {
    return moment(date).format('ddd[,] MMM D, h:mm a');
  } else { //if (L == 'long') {
    return moment(date).format('ddd[,] MMM D YYYY');
  }
};

UI.registerHelper('dateFormat', function(date,year){
    return dateFormat(date,year);
});
