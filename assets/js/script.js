var dataTableHandle;
$(document).ready( function () {
    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        "columnDefs": [
            { "orderable": false, "targets": [2] }
        ]
    });
    //Initialize the modal window (New Item Window)
    $('.modal').modal();  
} );

//Array for storing current grocery entries
var groceryItemArray = [];

//Variables for grocery table
var groceryTableListElement = $("#grocery-table")

//Varaibles for "New Item" button
var newItemButtonElement = $("#new-item-button");
var newItemFormElement = $('#new-item-modal');

//Variables for modal 
var groceryItemInputElement = $('#grocery-item-input');
var expirationDateInputElement = $('#expiration-date-input');  
var submitGroceryItemElement = $('#submit-grocery-item');

var testDiv = $('#text-div')

//Function for adding a new grocery item
function addGroceryItem(event) { 

    //Create new item to store inputted values
    let newItem = {
        "label":'',
        "expirationDate":'',
        "id":''
    }

    //Add inputs from modal fields    
    newItem.label = groceryItemInputElement.val();
    newItem.expirationDate = expirationDateInputElement.val();
    
    //Get unix code momentjs
    let newId = moment().format('X');
    newItem.id = newId;

    //Reset input values
    groceryItemInputElement.val('');
    expirationDateInputElement.val('');

    //Add new item to array
    groceryItemArray.push(newItem);

    //Add row to table
    addRow(newItem);
    

    //Console log to view
    console.log(newItem);
    console.log(groceryItemArray);

    //Add items to local storage
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));

}

function addRow(newItem) {
    // let newRow = $(document.createElement('tr'))

    // let newLabel = $(document.createElement('td'))
    // let newDate = $(document.createElement('td'))
    // let newButton = $(document.createElement('td'))

    // newLabel.text(newItem.label);
    // newDate.text(newItem.expirationDate);

    // let aTag = $(document.createElement('a'));
    // let iTag = $(document.createElement('i'));

    // aTag.addClass('delete_grocery');
    // aTag.attr('href','#');
    // aTag.attr('data-id', newItem.id);

    // iTag.addClass('far fa-window-close fa-w-16 fa-2x');
    
    // newRow.attr('id','item_' + newItem.id);

    // Assemble tags
    // aTag.append(iTag);
    // newButton.append(aTag);

    // newRow.append(newDate);
    // newRow.append(newButton);

    dataTableHandle.row.add([newItem.label, newItem.expirationDate, '<a href="#" class="delete_grocery" data-id = "'+newItem.id+'"><i class="far fa-window-close fa-w-16 fa-2x"></i></a>']).draw();

}




// create function to fill data table
// function fillList () {
//     var storedFood = JSON.parse(localStorage.getItem('groceryItemArray'))

// }
// // create function to populate data table
// function renderList(){
//      for (var i =0; i < groceryItemArray.length; i++)
//      var groceryItemArray=groceryItemArray[i]

// }

//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);

