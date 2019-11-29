/**
 * Concept of Modules in JS is the use of IIFE's (Immediately Invoked Function Expression) and Closers
 * The secret of the Module Pattern is that it returns an Object containing all the functions that we
 * want public (so the functions that we want the outside scope to have access )
 * */ 

 //BUDGET MODULE -- FOR DATA ENCAPSULATION AND SEPARATION OF CONCERNS
var budgetController = (function() {  

  //PRIVATE METHOD (NOT ACCESSIBLE GLOBALLY)
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //PRIVATE
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //PRIVATE
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(curEle) {
      sum += curEle.value;
    });
    data.totals[type] = sum;

  };

  //PRIVATE
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: {
      percentage: -1 //doesn't exist at this point
    }
  };

  return {

    //PUBLIC METHODS (Separated by commas) -- What the module RETURNS
    addItem: function(type, des, val) {
      var newItem, ID;

      //Create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length-1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    //PUBLIC
    calculateBudget: function() {
      //1. calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //2. Calculate the budge: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //3. Calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    //PUBLIC
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    //PUBLIC
    testing: function() {
      console.log(data);
    }
  };
})(); //IIFE 

//UI MODULE -- FOR DATA ENCAPSULATION AND SEPARATION OF CONCERNS
UIController = (function() {

  //PRIVATE METHOD (NOT ACCESSIBLE GLOBALLY)
  var DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    //PUBLIC METHODS (Separated by commas)
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be either 'inc' or 'exp'
        desc: document.querySelector(DOMStrings.inputDesc).value,
        val: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };     
    },
    //PUBLIC
    addListItem: function(obj, type) {
      var html, newHTML, ele;

      //Create HTML string with paceholder text
      if(type === 'inc') {
        ele = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if(type === 'exp') {
        ele = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace the placeholder text with some actual data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      //Insert the HTML into the DOM
      document.querySelector(ele).insertAdjacentHTML('beforeend', newHTML);
    },
    //PUBLIC
    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(currentVal, index, array) {
        currentVal.value = "";
      });
      fieldsArr[0].focus();
    },
    //PUBLIC
    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

      if(obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    //PUBLIC
    getDOMStrings: function() {
      return DOMStrings;
    }
  }

})();

//APP MODULE -- FOR DATA ENCAPSULATION AND SEPARATION OF CONCERNS
var appController = (function(budgetCtrl, UICtrl) {  //module
  var DOM = UICtrl.getDOMStrings();
  
  //PRIVATE
  var setupEventListeners = function() {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    //PRIVATE
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {
    //1.  Calculate the budget
    budgetCtrl.calculateBudget();

    //2. Return the budget
    var budget = budgetCtrl.getBudget();
    
    //3.  Display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  //PRIVATE
  var ctrlAddItem = function() {
    var input, newItem;

    //1.  Get the field input data
    input = UICtrl.getInput();

    if(input.desc !== "" && !isNaN(input.val) && input.val > 0 ) {
      //2.  Add the item tot he budget appController
      newItem = budgetCtrl.addItem(input.type, input.desc, input.val);

      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fields
      UICtrl.clearFields();

      //Calculate and update budget
      updateBudget();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID) {
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = splitID[1];

      //1. dete the item formt he data structure

      //2. Delete the item from the UI

      //3. Update and show the budget
    } else {

    }
  };

  //PUBLIC -- ONE METHOD TO CONTROL THE APPLICATION: "init"
  return {
    init: function() {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalInc: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

appController.init();