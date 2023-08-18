const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const addBtn = document.getElementById('add');
const clearBtn = document.getElementById('clear');
const itemList = document.getElementById('sortable-list');

addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    // Clear previous error messages
    clearErrors();

    if (title === '') {
        displayError(titleInput, 'Title cannot be empty.');
        return;
    }

    if (description === '') {
        displayError(descriptionInput, 'Description cannot be empty.');
        return;
    }

    // Add item to list
    addItemToList(title, description);

    // Clear input fields
    titleInput.value = '';
    descriptionInput.value = '';
});

clearBtn.addEventListener('click', () => {
    if (confirm('Warning! This action is irreversible. Do you want to proceed?')) {
        clearStorage();
        updateList();
    }
});

function displayError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger';
    errorDiv.textContent = message;
    inputElement.parentNode.appendChild(errorDiv);
}

function clearErrors() {
    const errorMessages = document.getElementsByClassName('error-message');
    for (const errorMessage of errorMessages) {
        errorMessage.remove();
    }
}

function addItemToList(title, description) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" onclick="toggleDone(this)">
                ${title}
            </label>
            <div>
                <button class="btn btn-warning btn-sm" onclick="editItem(this)">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(this)">Delete</button>
            </div>
        </div>
        <p class="mb-0">${description}</p>
    `;

    itemList.appendChild(listItem);
    updateListOrder();
}

function toggleDone(checkbox) {
    const listItem = checkbox.closest('.list-group-item');
    listItem.classList.toggle('done');
}

function deleteItem(button) {
    const listItem = button.closest('.list-group-item');
    listItem.remove();
    updateListOrder();
}

function editItem(button) {
    const listItem = button.closest('.list-group-item');
    const title = listItem.querySelector('label').textContent.trim();
    const description = listItem.querySelector('p').textContent.trim();

    titleInput.value = title;
    descriptionInput.value = description;

    listItem.remove();
    updateListOrder();
}

function clearStorage() {
    localStorage.clear();
}

function updateList() {
    const itemsJson = localStorage.getItem('itemsJson');
    if (itemsJson) {
        const itemsArray = JSON.parse(itemsJson);
        itemList.innerHTML = '';
        itemsArray.forEach(item => {
            addItemToList(item[0], item[1]);
        });
    }
}

function updateListOrder() {
    const listItems = itemList.querySelectorAll('.list-group-item');
    const newOrder = [];
    for (const listItem of listItems) {
        newOrder.push([listItem.querySelector('label').textContent.trim(), listItem.querySelector('p').textContent.trim()]);
    }
    localStorage.setItem('itemsJson', JSON.stringify(newOrder));
}

// Initial list update
updateList();
