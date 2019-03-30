'use strict';

const STORE = {
    items: [
    {id: cuid(), name: 'apple', checked: false},
    {id: cuid(), name: 'oranges', checked: true},
    {id: cuid(), name: 'almond butter', checked: false},
    {id: cuid(), name: 'bread', checked: false},
    {id: cuid(), name: 'milk', checked: true}],
    hideCompleted: false,
    searchTerm: null
};

function generateItemElement(item) {
    console.log('generateItemElement ran');
    let itemMainTitle;
    if (item.isEditing) {
        itemMainTitle = `
        <form id="edit-item-name-form">
            <input type="text" name="edit-name" class="js-edit-item-name" value="${item.name}">
        </form>
        `;
    } else {
        itemMainTitle = `
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">
            ${item.name}
        </span>`;
    }

    const disabledStatus = item.isEditing ? 'disabled' : '';
    
    return `
    <li data-item-id="${item.id}">
        ${itemMainTitle}
        <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle" ${disabledStatus}>
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete" ${disabledStatus}>
            <span class="button-label">delete</span>
        </button>
        </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
    console.log('generateShoppingItemsString ran');
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
}

function renderShoppingList() {
    console.log('renderShoppingList ran');
    // this function will display shopping cart items
    // on the DOM
    // -----------------------------------------------------------------
    // for each item in STORE.items, generate a string representing an <li> with
    //     the item name rendered as innner text
    //     the item's index in the STORE.items set as a data attribute on the <li>
    //     the item's checked state (t/f) rendered as teh pressence or absence
    //     of a CSS class for indicating checked items (.shopping-item__checked)
    // join together the individual item strings into one long string
    // insert the <li> string inside the .js-shopping-list <ul> in the DOM
    let filteredItems = STORE.items;
    if (STORE.hideCompleted) {
        filteredItems = filteredItems.filter(item => !item.checked);
    }
    // make sure the search form input matches the current STORE entry
    $('.js-search-term').val(STORE.searchTerm);
    // if 'searchTerm' property is not null, then we want to reassign
    // filteredItems to a version that scans the item name for the searchTerm substring
    if (STORE.searchTerm) {
        filteredItems = filteredItems.filter(item => item.name.includes(STORE.searchTerm));
    }
    const shoppingListItemsString = generateShoppingItemsString(filteredItems);
    $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
    console.log(`Adding "${itemName}" to shopping list`);
    STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
    // this function will add a new item to our shopping cart
    // -----------------------------------------------------------------
    // this function will listen for when the add item button was clicked
    // grab user-input from input form
    //     select input form, copy that text
    //     clear input form
    // create an object from the user input (new function)
    //     id will be randomly generated
    //     new function will set the name of the object to the user-input
    //     the item's checked state (t/f) will be false
    // add the new object to the STORE.items
    // rerender shopping list (renderShoppingList()).
    $('#js-shopping-list-form').on('submit', function(event) {
        event.preventDefault();
        console.log('handleNewItemSubmit ran');
        const newItemName = $('.js-shopping-list-entry').val();
        $('.js-shopping-list-entry').val('');
        addItemToShoppingList(newItemName);
        renderShoppingList();
    });
}

function getItemIdFromElement(item) {
    return $(item).closest('li').data('item-id');
}

function toggleCheckedForListItem(itemId) {
    const item = STORE.items.find(item => item.id === itemId);
    item.checked = !item.checked;
}

function handleItemCheckClicked() {
    console.log('`handleItemCheckClicked` ran');
    // this function will toggle whether an item is checked or not
    // -----------------------------------------------------------------
    // this function will listen for when the check button was clicked
    // retrieve the item's id from the data attribute
    // search through the STORE.items, till we find the object with the correct id
    // toggle the clecked state (t/f) of that object
    // rerender shopping list (renderShoppingList())
    $('.js-shopping-list').on('click', `.js-item-toggle`, function(event) {
        console.log('`handleItemCheckClicked` ran');
        const itemId = getItemIdFromElement(event.currentTarget);
        console.log(itemId);
        toggleCheckedForListItem(itemId);
        renderShoppingList();
    });
}

function deleteForListItem(itemId) {
    console.log(`deleteForListItem ran for ${itemId}`);
    const itemIndex = STORE.items.findIndex(item => item.id === itemId);
    STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
    console.log('handleDeleteItemClicked ran');
    // this function will delete items from our shopping list
    // -----------------------------------------------------------------
    // this function will listen for when the delete button was clicked
    // retrieve the item's id from the data attribute
    // search through the STORE.items, till we find the object with the correct id
    // remove that object from the list
    // rerender shopping list (renderShoppingList())
    $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
        // console.log('handleDeleteItemClicked ran');
        const itemId = getItemIdFromElement(event.currentTarget);
        // console.log(itemId);
        deleteForListItem(itemId);
        renderShoppingList();
    });
}

function toggleHideFilter() {
    // Toggles the STORE.hideCompleted property
    STORE.hideCompleted = !STORE.hideCompleted;
    console.log(STORE.hideCompleted);

}

function handleToggleHideFilter() {
    console.log('handleToggleHideFilter ran');
    // listen for when the user toggles the checkbox for hiding completed items
    $('.js-hide-completed-toggle').on('click', function () {
        console.log('handleToggleHideFilter was toggled');
        toggleHideFilter();
        renderShoppingList();
    });
}

function setSearchTerm(searchTerm) {
    STORE.searchTerm = searchTerm;
}

function handleSearchSubmit() {
    console.log('handleUserSearchItem ran');
    // User can type in a search term and the displayed list wil
    // be filtered by item names only containing that search term
    // ------------------------------------------------------------------------
    // listen for when user clicks search button
    // Traverse to input form
    //     save text as a variable
    //     empty out input form
    // set STORE.filterSearchResults to true
    // In renderer
    //     If STORE.filterSearchResults is set to true
    //         filter filterItems by user input
    // listen for when user clicks reset button
    // set STORE.filterSearchResults to false
    // rerender DOM
    $('#js-search-term-form').on('submit', function(event) {
        event.preventDefault();
        const searchTerm = $('.js-search-term').val();
        setSearchTerm(searchTerm);
        renderShoppingList();
    });
}

function handleSearchClear() {
    $('#search-form-clear').on('click', () => {
        setSearchTerm('');
        renderShoppingList();
    });
}

function setItemIsEditing(itemId, isEditing) {
    const targetItem = STORE.items.find(item => item.id === itemId);
    targetItem.isEditing = isEditing;
}

function handleItemNameClick() {
    $('.js-shopping-list').on('click', '.js-shopping-item', event => {
        const id = getItemIdFromElement(event.currentTarget);
        setItemIsEditing(id, true);
        renderShoppingList();
    });
}

function editItemName(itemId, newName) {
    const targetItem = STORE.items.find(item => item.id === itemId);
    targetItem.name = newName;
}

function handleEditItemForm() {
    console.log('handleEditItemForm ran');
    $('.js-shopping-list').on('submit', '#edit-item-name-form', event => {
        event.preventDefault;
        const id = getItemIdFromElement(event.currentTarget);
        const newName = $('.js-edit-item-name').val();
        editItemName(id, newName);
        setItemIsEditing(id, false);
        renderShoppingList();
    });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
    console.log('handleShoppingList ran');
    renderShoppingList();
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleToggleHideFilter();
    handleSearchSubmit();
    handleSearchClear();
    handleEditItemForm();
    handleItemNameClick()
}

$(handleShoppingList);