var dataTableHandle;
$(document).ready( function () {
    
       
     
    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        "order": [[ 1, "desc" ]],
        "columnDefs": [
            //disabel sorting for the remove button column
            { "orderable": false, "targets": [0,3] },
            //add class to center the buttons of the remove button column
            { "className": "text_align_center", "targets": [ 0,3 ] }
        ]
    });
    //Call the fillList function to populate the datatable from local storage
    fillList();
    //Initialize the modal window (New Item Window)
    $('.modal').modal();  
    M.updateTextFields();
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
var expirationDateInputElement = $('.datepicker');  
var submitGroceryItemElement = $('#submit-grocery-item');


//reset Form 
newItemButtonElement.on("click",function(){
    groceryItemInputElement.val('');
    expirationDateInputElement.val('');
    $("#modal_title").text("New Ingredient");
    $('#expiration-date-input').val(' ');
  M.textareaAutoResize($('#expiration-date-input'));
  $('#grocery-item-input').val(' ');
  M.textareaAutoResize($('#grocery-item-input'));
});

var testDiv = $('#text-div')

// Initalize the date picker set format to day month year and to auto close when date is selected
$('.datepicker').datepicker({
    container: '.datecont',
    format:'dd-mm-yyyy',
    autoClose: true,  
});

function add_extra_info(newItem){
    rUrl="https://api.spoonacular.com/food/ingredients/search?apiKey=e52a263a34ae41e597206f99fb2dde1d&query="+newItem.label+"&number=1&sort=calories&sortDirection=asc"
    $.get(rUrl, function() {}).done(function(data) { 
        if (data.results[0]){        
            var img="https://spoonacular.com/cdn/ingredients_100x100/"+data.results[0].image
            newItem.ingrediantImg = img; 
            //Add item to array 
            groceryItemArray.push(newItem);
            $("#ingImg_"+newItem.id).attr("src",img);
        }
        localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));
        
    });
}
//Function for adding/updating grocery items
function addGroceryItem(event) { 
    //Create new item to store inputted values
    var newItem;
    var obj_id = newItemFormElement.data("editing")
    //Create new item to store inputted values
    existing_check = getIndexFromGroceryItemId(obj_id);
    if(existing_check !== null){
        //get the existing item from the array
        newItem = groceryItemArray[existing_check]
         //update item
        newItem.label = groceryItemInputElement.val();
        newItem.expirationDate = expirationDateInputElement.val();
         //update datatable with new values
        $("#ingl_"+obj_id).text(newItem.label)
        $("#ingex_"+obj_id).text(newItem.expirationDate)
        //remove old item from storage 
        remove_from_storage(obj_id);
        //push the new item to the array to be added to the localStorage
    }else{
        newItem = {
        "label":'',
        "expirationDate":'',
        "ingrediantImg":'',
        "ingrediantInfo":'',
        "id":''
        }
        //Add inputs from modal fields    
        newItem.label = groceryItemInputElement.val();
        newItem.expirationDate = expirationDateInputElement.val();
        let newId = moment().format('X');
        newItem.id = newId;

        //Add row to table
        addRow(newItem);
    }

    groceryItemInputElement.val('');
    expirationDateInputElement.val('');
  
    //Add items to local storage
    add_extra_info(newItem);

}

function addRow(newItem,editing=false) {
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
    newButton.append('&nbsp;&nbsp;<a data-target="new-item-modal" class="edit_grocery modal-trigger" href="#" data-id="'+newItem.id+'"><i class="far fa-edit fa-w-16 fa-2x"></i></a>');

    //set a handle for the new row, added the .html() to the generated button tag, .node() to create a node of the row
    var newRow = dataTableHandle.row.add(
        ['<img id="ingImg_'+newItem.id+'" src="'+newItem.ingrediantImg+'"/>',
        '<span id="ingl_'+newItem.id+'">'+newItem.label+'</span><br><span>'+newItem.ingrediantInfo+'</span>',
        '<span id="ingex_'+newItem.id+'">'+newItem.expirationDate+'</span>', 
        newButton.html()]
        ).draw().node();

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

//Helper function to return the groceryItemArray index of the element with the matching id
function getIndexFromGroceryItemId(groceryItemId){
    let targetIndex = -1;

    //Check for item with matching id in the current grocery array
    for (let i = 0; i < groceryItemArray.length; i++) {
        const element = groceryItemArray[i];

        //Check if id's match
        if(+element.id === groceryItemId){
            //If they do match, get the index
            targetIndex = i;
        }
    }

    //Check if the target index exists.If it does, return it. Otherwise, return null.
    if(targetIndex === -1){
        return null;
    }else{
        return targetIndex;
    }
}

//edit gorceries
$("body").on("click", ".edit_grocery", function(){
    var grocId = $(this).data("id");
    $("#expiration-date-input").val($("#ingex_"+grocId).text());
    $("#grocery-item-input").val($("#ingl_"+grocId).text());
    $("#modal_title").text($("#ingl_"+grocId).text());
    $("#new-item-modal").attr("data-editing",grocId);
});

//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);

//remove object from the localstorage
function remove_from_storage(removeId){
    let index = getIndexFromGroceryItemId(removeId);

    if(index !== null){
        //Remove using splice method             
        groceryItemArray.splice(index,1)
        //-----Update local storage-----
        localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));
    }else{
        console.error('TARGET INDEX NOT FOUND IN GROCERY ITEMS ARRAY')
    }
}

//Event delegation for removing rows from the data table
$('#grocList').on('click', ".delete_grocery", function(){

    //-----Delete row from data table-----
    dataTableHandle.row($(this).parents('tr')).remove().draw();

    //-----Delete entry from current grocery item array-----

    //Get Id from selected element by accessing the data attribute
    let removeId = $(this).data('id');
    remove_from_storage(removeId);
})

