var dateFormat = function (date,year) {
  if (year) {
   return moment(date).format('ddd[,] MMM D YYYY');
  } else {
    return moment(date).format('ddd[,] MMM D');
  }
};

UI.registerHelper('dateFormat', function(date,year){
    return dateFormat(date,year);
});
