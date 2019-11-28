/**
 * Concept of Modules in JS is the use of IIFE's (Immediately Invoked Function Expression) and Closers
 * The secret of the Module Pattern is that it returns an Object containing all the functions that we
 * want public (so the functions that we want the outside scope to have access )
 * */ 

var budgetController = (function() {  //module
  

})(); //IIFE 

UIController = (function() { //module
  var DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be either 'inc' or 'exp'
        desc: document.querySelector(DOMStrings.inputType).value,
        val: document.querySelector(DOMStrings.inputValue).value
      };     
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  }

})();

var controller = (function(budgetCtrl, UICtrl) {  //module

  var DOM = UICtrl.getDOMStrings();
  var ctrlAddItem = function() {

    var input = UICtrl.getInput();
    console.log(input);
  }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

})(budgetController, UIController);