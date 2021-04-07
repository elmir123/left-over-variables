var dataTableHandle;
var smallimgBase="https://spoonacular.com/cdn/ingredients_100x100/";
var grocImg = $("#grocery-item-img");
var grocSpoonId = $("#grocery-item-spoonacularid");
$(document).ready( function () {

    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        "order": [[ 2, "desc" ]],
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


$("#grocery-item-input").autocomplete({
    source: function (request, response) {
        $.getJSON("https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=e52a263a34ae41e597206f99fb2dde1d&query="+request.term+"&metaInformation=true", 
          {  }, 
          function(data) {
            var dataform=[]
              if(data){
                  dataform = data.map(function(x){
                      return { label: x.name, id: x.id, img:x.image }
                  })
              }
              response(dataform)
          }
        );      
    },
    minLength: 2,
    select: function( event, ui ) {
        grocImg.val(ui.item.img);
        grocSpoonId.val(ui.item.id);
    },
});

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
    newItemFormElement.removeAttr("data-editing");
    groceryItemInputElement.val(' ');
    expirationDateInputElement.val(' ');
    $("#modal_title").text("New Ingredient");

    grocImg.val("");
    grocSpoonId.val("");
});

var testDiv = $('#text-div')

// Initalize the date picker set format to day month year and to auto close when date is selected
$('.datepicker').datepicker({
    container: '.datecont',
    format:'dd-mm-yyyy',
    autoClose: true,  
});

function add_extra_info(newItem){
    main_nut=["Cholesterol","Calories","Fat","Carbohydrates","Sugar","Protein","Fiber"]
    rUrl="https://api.spoonacular.com/food/ingredients/"+newItem.spoonacularId+"/information?amount=1&apiKey=e52a263a34ae41e597206f99fb2dde1d"
    console.log(rUrl);
    $.get(rUrl, function() {}).done(function(data) { 
        console.log(data)
        // if (data.results[0]){     
        //     console.log(data.results[0]);
        //     // newItem.ingrediantInfo=""
        //     // $("#ingl_"+newItem.id).after('<br><span>'+newItem.ingrediantInfo+'</span>')
        //     //Add item to array 
        // }
        
    }).always(function() {
        groceryItemArray.push(newItem);
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
        newItem.spoonacularId = grocSpoonId.val()
        newItem.ingrediantImg = grocImg.val()
        
        //update datatable with new values
        $("#ingl_"+obj_id).text(newItem.label)
        $("#ingex_"+obj_id).text(newItem.expirationDate)
        $("#ingImg_"+obj_id).attr("src",smallimgBase+newItem.ingrediantImg)
        
        //remove old item from storage 

        remove_from_storage(obj_id);
        //push the new item to the array to be added to the localStorage
    }else{
        newItem = {
        "label":'',
        "expirationDate":'',
        "ingrediantImg":'',
        "ingrediantInfo":'',
        "spoonacularId":'',
        "id":''
        }
        //Add inputs from modal fields    
        newItem.label = groceryItemInputElement.val();
        newItem.expirationDate = expirationDateInputElement.val();
        newItem.spoonacularId = grocSpoonId.val()
        newItem.ingrediantImg = grocImg.val()

        let newId = moment().format('X');
        newItem.id = newId;
        console.log($("#grocery-item-input").data("spoonacularid"), $("#grocery-item-input").data("img"), newItem.ingrediantImg, "Here2");
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
    newButton.append('&nbsp;&nbsp;<a data-target="new-item-modal" class="edit_grocery modal-trigger" href="#" data-id="'+newItem.id+'" data-img="'+newItem.ingrediantImg+'" data-spid="'+newItem.spoonacularId+'"><i class="far fa-edit fa-w-16 fa-2x"></i></a>');

    //set a handle for the new row, added the .html() to the generated button tag, .node() to create a node of the row
    var newRow = dataTableHandle.row.add(
        ['<img id="ingImg_'+newItem.id+'" src="'+smallimgBase+newItem.ingrediantImg+'"/>',
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
    var img = $(this).data("img");
    var sponid = $(this).data("spid");
    $("#expiration-date-input").val($("#ingex_"+grocId).text());
    $("#grocery-item-input").val($("#ingl_"+grocId).text());
    $("#modal_title").text($("#ingl_"+grocId).text());
    $("#new-item-modal").attr("data-editing",grocId);
    console.log(sponid,img)
    grocSpoonId.val(sponid)
    grocImg.val(img)
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
$('#grocList').on('click', ".delete_grocery", function(event){
    event.preventDefault();
    //-----Delete row from data table-----
    dataTableHandle.row($(this).parents('tr')).remove().draw();

    //-----Delete entry from current grocery item array-----

    //Get Id from selected element by accessing the data attribute
    let removeId = $(this).data('id');
    remove_from_storage(removeId);
})

