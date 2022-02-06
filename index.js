//item controller
let trackTarget;  
const ItemCtrl = (function(){
    // datastructure
    const data = function(meal, calories){
        this.meal = meal;
        this.calories = calories;
    }
    //data
    const datastructure = {
        items : [],
        totalCalories : 0
    }

    return{
        logData : function(){
            return datastructure.items;
        },
        addToDtastructure : function(meal, cal){
            let newDta = new data(meal, cal);
            datastructure.items.push(newDta)
            return datastructure;
        },
        calculateCal : function(){
            let totalCal = 0 ;
            datastructure.items.forEach(function(object){
                totalCal += object.calories;
            });
            return totalCal;
        },
        updateCal : function(total){
            datastructure.totalCalories = total; 
        },
        updatelist : function(meal, calories){
            trackTarget.parentNode.firstChild.nextSibling.firstChild.nextSibling.textContent = meal;
            trackTarget.parentNode.firstChild.nextSibling.childNodes[3].textContent = calories;
        },
        updateDatastructure : function(meal, calories){
            datastructure.items.forEach(function(items){
                if(items.meal == trackTarget.parentNode.firstChild.nextSibling.firstChild.nextSibling.textContent &&
                    items.calories ==  trackTarget.parentNode.firstChild.nextSibling.childNodes[3].textContent){
                        items.meal = meal;
                        items.calories = calories;
                    }
            })
        },
        deleteFromDatastructure : function(meal, cal){
            datastructure.items.forEach(function(item, index){
                if(item.meal == meal && item.calories == cal ){
                        datastructure.items.splice(index,1);
                    }
            })
        },
        clearDatastructure : function(){
            datastructure.items = [];
            datastructure.totalCalories = 0;
        },
        addToLocalstorage : function(){
            localStorage.setItem("item", JSON.stringify(datastructure.items));
            localStorage.setItem("totalCalories",datastructure.totalCalories)
        }

    }
})();
//uicontroller
const UICtrl = (function(){
    const UISelector = {
        result : ".result",
        button : ".addmeal",
        mealInput : "#add-meal",
        caloriesInput : "#add-calories",
        totalCal : ".total",
        edit : ".edit-state",
        item : "#list-item",
        updateButton : ".update",
        deleteButton : ".delete",
        backButton : ".back",
        clearAll : ".btn"
    }
    //clearAll
    const clearAll = function(){
        UICtrl.clearInput();
        ItemCtrl.clearDatastructure();
        UICtrl.clearList();
        localStorage.clear()
    }
    //defining back
    const back = function(){
        UICtrl.hideEdit();
        UICtrl.clearInput();
    }
    //update meal
    const updateMeal = function(){
        const mealInput = document.querySelector(UISelector.mealInput).value;
        const caloriesInput = document.querySelector(UISelector.caloriesInput).value;
        const caloriesInputNum = parseInt(caloriesInput);
        //creating element
        if(caloriesInput == "" || mealInput == ""){
            console.log("fields are empty");
        }else{
            ItemCtrl.updateDatastructure(mealInput, caloriesInputNum);
            ItemCtrl.updatelist(mealInput, caloriesInputNum);
            const totalcal =  ItemCtrl.calculateCal();
            ItemCtrl.updateCal(totalcal);
            ItemCtrl.addToLocalstorage();
            UICtrl.showTotalCal(totalcal);
            UICtrl.clearInput();
            UICtrl.hideEdit();
            
        }
    }
    //delete meal
    const deleteMeal = function(){
        const mealInput = document.querySelector(UISelector.mealInput).value;
        const caloriesInput = document.querySelector(UISelector.caloriesInput).value;
        const caloriesInputNum = parseInt(caloriesInput);
        ItemCtrl.deleteFromDatastructure(mealInput, caloriesInputNum);
        ItemCtrl.addToLocalstorage();
        const totalcal =  ItemCtrl.calculateCal();
        ItemCtrl.updateCal(totalcal);
        UICtrl.deleteFromList();
        UICtrl.clearInput();
        UICtrl.hideEdit();
        UICtrl.showTotalCal(totalcal);
    }
    //add meal
    const addMeal = function(){
        const mealInput = document.querySelector(UISelector.mealInput).value;
        const caloriesInput = document.querySelector(UISelector.caloriesInput).value;
        const caloriesInputNum = parseInt(caloriesInput);
        //creating element
        if(caloriesInput == "" || mealInput == ""){
            console.log("fields are empty")
        }else{
            ItemCtrl.addToDtastructure(mealInput, caloriesInputNum);
            const totalcal =  ItemCtrl.calculateCal();
            ItemCtrl.updateCal(totalcal);
            ItemCtrl.addToLocalstorage();
            UICtrl.showTotalCal(totalcal)
            UICtrl.clearInput();
            let div = document.createElement("div");
            div.className = "li";
            div.innerHTML =  `
                    <div class = "group">
                        <div>${mealInput}</div>
                        :
                        <div>${caloriesInputNum}</div>
                        calories
                    </div>
                    <div id = "list-item">#</div>
                 `
            document.querySelector(UISelector.result).insertAdjacentElement("beforeend", div);
            
            
        }
    }
    const displayList = function(){
        let ListItems = JSON.parse(localStorage.getItem("item"))
        console.log(ListItems)
        let html = "";
        ListItems.forEach(function(item){
            html += `
                <div class= "li">
                    <div class = "group">
                        <div>${item.meal}</div>
                        :
                        <div>${item.calories}</div>
                        calories
                    </div>
                    <div id = "list-item">#</div>
                </div>
            `         
        })

        document.querySelector(".result").innerHTML = html;
        let totalcal = ItemCtrl.calculateCal();
        UICtrl.showTotalCal(totalcal);

    }
    return{
        PopulateItem : function(init){
            let html = "";
            init.forEach(function(object){
                html += `
                <div class = "li">
                    <div class = "group">
                        <div>${object.meal}</div>
                        :
                        <div>${object.calories}</div>
                        calories
                    </div>
                    <div id = "list-item">#</div>
                </div> 
                `
            })
            document.querySelector(UISelector.result).innerHTML = html;
            let totalCal = ItemCtrl.calculateCal()
            UICtrl.showTotalCal(totalCal)
        },
        loadEventListners : function(){
            document.querySelector(UISelector.button).addEventListener("click",addMeal);
            document.addEventListener("click", function(e){
                if(e.target.id == "list-item"){
                    trackTarget = e.target;
                    document.querySelector(UISelector.button).style.display = "none";
                    UICtrl.showEdit();
                    let meal = e.target.parentNode.firstChild.nextSibling.firstChild.nextSibling.textContent;
                    let cal = e.target.parentNode.firstChild.nextSibling.childNodes[3].textContent;
                    UICtrl.fillInput(meal, cal);
                    
                }
            })
            document.querySelector(UISelector.updateButton).addEventListener("click", updateMeal);
            document.querySelector(UISelector.deleteButton).addEventListener("click", deleteMeal);
            document.querySelector(UISelector.backButton).addEventListener("click", back);  
            document.querySelector(UISelector.clearAll).addEventListener("click", clearAll);
            document.addEventListener("DOMContentLoaded", displayList)
            
        },
        clearInput : function(){
            document.querySelector(UISelector.mealInput).value = "";
            document.querySelector(UISelector.caloriesInput).value = "";
        },
        showTotalCal : function(total){
            document.querySelector(UISelector.totalCal).textContent = `Total calories : ${total}`;
        },
        getSelector : function(){
            return UISelector;
        },
        hideEdit : function(){
            document.querySelector(UISelector.edit).style.display = "none";
            document.querySelector(UISelector.button).style.display = "flex";

        },
        showEdit : function(){
            document.querySelector(UISelector.edit).style.display = "flex";
        },fillInput : function(meal, calories){
            document.querySelector(UISelector.mealInput).value = meal;
            document.querySelector(UISelector.caloriesInput).value = calories;
        },
        deleteFromList : function(){
            trackTarget.parentNode.remove();
        },
        clearList : function(){
            const nodes = document.querySelectorAll(".li");
            nodes.forEach(function(node){
                node.remove();
            })
            document.querySelector(UISelector.totalCal).textContent = `Total calories : 0`
        }
    }
})();

//appcontroller
const App = (function(UICtrl, ItemCtrl){
    
    return{
        init : function(){
            //hiding edit
            UICtrl.hideEdit();
            const total = ItemCtrl.calculateCal();
            UICtrl.showTotalCal(total);
            const initializer = ItemCtrl.logData();
             //initializing
            UICtrl.PopulateItem(initializer);
            //loadEventListners
            UICtrl.loadEventListners();

        }
    }
})(UICtrl,ItemCtrl);
App.init();
console.log(ItemCtrl.logData());

