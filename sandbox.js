// Select the necessary DOM elements
const todoList = document.querySelector(".list-group.todos");
const todoInput = document.getElementsByName("add")[0]; // Input field for new tasks
const searchInput = document.getElementsByName("search")[0]; // Input field for search filter

// Prevent form submission for the search form
const todoForm = document.querySelector(".search");
todoForm.addEventListener("submit", function(event) {
    event.preventDefault();
});

// Function to add a new task to the list
todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && todoInput.value.trim() !== "") {
        event.preventDefault();

        // Get the task text
        const todoText = todoInput.value.trim();

        // Create a new list item with the task text and delete icon
        const todoItem = document.createElement("li");
        todoItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        todoItem.innerHTML = `
            <span>${todoText}</span>
            <i class="far fa-trash-alt delete"></i>
        `;

        // Append the new task to the list
        todoList.appendChild(todoItem);

        // Clear the input field after adding the task
        todoInput.value = "";
    }
});

// Function to filter the tasks based on the search input
function filterTodos() {
    const filterText = searchInput.value.toLowerCase(); // Get the filter text and convert to lowercase
    const todoItems = todoList.getElementsByTagName("li");

    console.log("Filtering tasks..."); // Debugging log to check if function is called
    // Loop through all list items and show/hide based on the filter
    Array.from(todoItems).forEach(function(item) {
        const taskText = item.querySelector("span").textContent.toLowerCase();
        console.log("Checking task: ", taskText); // Debugging log to see what tasks are being checked
        if (taskText.startsWith(filterText)) {
            console.log("Task matched filter: ", taskText); // Debugging log to see which tasks match the filter
            // Show item if it matches the filter
            item.className = "list-group-item d-flex justify-content-between align-items-center";

        } else {
            console.log("Task did not match filter: ", taskText); // Debugging log to see which tasks don't match the filter
            // Hide item if it doesn't match the filter
            item.className = "hiden";
        
        
        }
    });
}

// Add an event listener to the search input to filter tasks as the user types
searchInput.addEventListener("keyup", function(event) {
    filterTodos(); // Call the filter function every time the user types
});

// Function to delete a task when the delete icon is clicked
todoList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove(); // Remove the task from the list
    }
});
