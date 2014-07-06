var isGT = function (val1,val2) {  
  return (val1 > val2);
}; 

UI.registerHelper('isGT', function(val1,val2){
    return isGT(val1,val2);
});
