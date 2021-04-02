var dataTableHandle;
$(document).ready( function () {
    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        "columnDefs": [
            //disabel sorting for the remove button column
            { "orderable": false, "targets": [2] },
            //add class to center the buttons of the remove button column
            { "className": "text_align_center", "targets": [ 2 ] }
        ]
    });
    //Call the fillList function to populate the datatable from local storage
    fillList();
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
    //creating the remove button elements of the row
    let newButton = $(document.createElement('td'))
    let aTag = $(document.createElement('a'));
    let iTag = $(document.createElement('i'));
    
    //setting button attributes
    aTag.addClass('delete_grocery');
    aTag.attr('href','#');
    aTag.attr('data-id', newItem.id);
    iTag.addClass('far fa-window-close fa-w-16 fa-2x');
    
    // Assemble tags
    aTag.append(iTag);
    newButton.append(aTag);

    //set a handle for the new row, added the .html() to the generated button tag, .node() to create a node of the row
    var newRow = dataTableHandle.row.add([newItem.label, newItem.expirationDate, newButton.html()]).draw().node();

    // adding the id to the generated tr element
    $(newRow).attr('id','item_' + newItem.id);
}




//create function to fill data table
function fillList () {
    var storedFood = JSON.parse(localStorage.getItem('groceryItemArray'));
    if(storedFood){
        for (var i =0; i < storedFood.length; i++){
            newItem = storedFood[i];
            addRow(newItem);
            groceryItemArray.push(newItem);
        }   
    }
  }
// }
// // create function to populate data table
// function renderList(){
//        for (var i =0; i < groceryItemArray.length; i++)
//      var groceryItemArray=groceryItemArray[i]

// }

//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);

//Event delegation for removing rows from the data table
$('#grocList').on('click', ".delete_grocery", function(){

    //-----Delete row from data table-----
    dataTableHandle.row($(this).parents('tr')).remove().draw();

    //-----Delete entry from current grocery item array-----

    //Get Id from selected element by accessing the data attribute
    let removeId = $(this).data('id');

    //Check for item with matching id in the current grocery array, remove if id matches the id of the clicked row element
    for (let index = 0; index < groceryItemArray.length; index++) {
        const element = groceryItemArray[index];

        //Check if id's match
        if(+element.id === removeId){
            //Remove using splice method             
            groceryItemArray.splice(index,1)
        }
    }

    //-----Update local storage-----
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));

})