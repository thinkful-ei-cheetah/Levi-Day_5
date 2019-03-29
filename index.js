'use strict';

const STORE = {
    items: [
    {id: cuid(), name: 'apple', checked: false},
    {id: cuid(), name: 'oranges', checked: true},
    {id: cuid(), name: 'almond butter', checked: false},
    {id: cuid(), name: 'bread', checked: false},
    {id: cuid(), name: 'milk', checked: true}],
    hideCompleted: false
};

function generateItemElement(item) {
    console.log('generateItemElement ran');
    return `
    <li data-item-id="${item.id}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
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
}

$(handleShoppingList);