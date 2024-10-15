// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the sprint name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sprintName = urlParams.get('sprintName');
    const closeButton = document.querySelector('.close');


    const taskForm = document.getElementById('taskForm');
    var modal = document.getElementById('taskModal');
    
    // Retrieve the kanbanBoardItems from localStorage
    let kanbanBoardItems = JSON.parse(localStorage.getItem('kanbanBoardItems')) || {};

    // Get the tasks associated with the specific sprint
    const sprintTasks = kanbanBoardItems[sprintName] || [];


    // getting sprint columns
    const notStartedList = document.getElementById('Not Started');
    const activeList = document.getElementById('In Progress');
    const completedList = document.getElementById('Completed');

    const lists = document.querySelectorAll('.draggable-list');
    let draggedItem = null;

    // list of tasks
    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    console.log(sprintTasks)

    const mainContainer = document.querySelector('.main-container');

    lists.forEach(list => {
        list.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'LI') {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        list.addEventListener('dragend', function (e) {
            if (e.target.tagName === 'LI') {
                setTimeout(() => {
                    e.target.classList.remove('dragging');
                    draggedItem = null;
                }, 0);
            }
        });

        list.addEventListener('dragover', function (e) {
            e.preventDefault(); // Prevent default to allow drop
            if (e.target.tagName === 'LI') {
                e.target.classList.add('over');
            }
        });

        list.addEventListener('dragleave', function (e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }
        });

        list.addEventListener('drop', function (e) {
            e.preventDefault(); // Prevent default action (open as link for some elements)
        
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
        
                // Move dragged item to the dropped position
                if (draggedItem !== this) {
                    let draggedIndex = [...this.parentNode.children].indexOf(draggedItem);
                    let targetIndex = [...this.parentNode.children].indexOf(e.target);
        
                    if (targetIndex > draggedIndex) {
                        this.insertBefore(draggedItem, e.target.nextSibling);
                    } else {
                        this.insertBefore(draggedItem, e.target);
                    }
                }
            }

            // If the drop happens on the list (not on an item), append the item at the end
            if (e.target === this && draggedItem !== null) {
                this.appendChild(draggedItem);
            }
        
            // Update the status of the dragged item based on the column it was dropped into
            const newStatus = this.id; // Assuming the list ID corresponds to the status
            const taskName = draggedItem.textContent; // Get the name of the task
        
            // Find the task in sprintTasks and update its status
            const task = sprintTasks.find(task => task.taskName === taskName);
            if (task) {
                task.status = newStatus.charAt(0).toUpperCase() + newStatus.slice(1); // Capitalize the status
            }

            // Save updated tasks back to localStorage
            kanbanBoardItems[sprintName] = sprintTasks; // Update tasks for the current sprint
            localStorage.setItem('kanbanBoardItems', JSON.stringify(kanbanBoardItems));

            // Sync the sprint data with updated statuses to localStorage
            let sprints = JSON.parse(localStorage.getItem('sprints')) || [];
            const sprintToUpdate = sprints.find(sprint => sprint.sprintName === sprintName);
            if (sprintToUpdate) {
                sprintToUpdate.selectedPBIS = sprintTasks; // Sync updated tasks
        
                // Check if all tasks are completed
                const allCompleted = sprintTasks.every(task => task.status === 'Completed');
                if (allCompleted) {
                    sprintToUpdate.status = 'Completed'; // Update sprint status to Completed
                    console.log(`Sprint "${sprintName}" marked as completed.`);
                }
        
                // Save changes to sprints in localStorage
                localStorage.setItem('sprints', JSON.stringify(sprints));
            }

            // Re-render the board to reflect the new state
            renderKanbanBoard(sprintTasks);
        });        
    });


    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Add Logout Functionality
    // Check if the user is logged in as admin or a regular user
    if (localStorage.getItem('isAdminLoggedIn') !== 'true' && localStorage.getItem('isUserLoggedIn') !== 'true') {
        // If not logged in, redirect to the login page
        window.location.href = "../Login Page/loginpage.html";
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Clear login status from localStorage
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('isUserLoggedIn');
            // Redirect to login page
            window.location.href = "../Login Page/loginpage.html";
        });
    }
    // make each item created draggable e.g. when adding a new sprint
    function itemDraggable(item) {
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'LI') {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        item.addEventListener('dragend', function (e) {
            if (e.target.tagName === 'LI') {
                setTimeout(() => {
                    e.target.classList.remove('dragging');
                    draggedItem = null;
                }, 0);
            }
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault(); // Prevent default to allow drop
            if (e.target.tagName === 'LI') {
                e.target.classList.add('over');
            }
        });

        item.addEventListener('dragleave', function (e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }
        });

        item.addEventListener('drop', function (e) {
            e.preventDefault(); // Prevent default action (open as link for some elements)

            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');

                // Move dragged item to the dropped position
                if (draggedItem !== this) {
                    let draggedIndex = [...this.parentNode.children].indexOf(draggedItem);
                    let targetIndex = [...this.parentNode.children].indexOf(e.target);

                    if (targetIndex > draggedIndex) {
                        this.insertBefore(draggedItem, e.target.nextSibling);
                    } else {
                        this.insertBefore(draggedItem, e.target);
                    }
                }
            }

            // If the drop happens on the list (not on an item), append the item at the end
            if (e.target === this && draggedItem !== null) {
                this.appendChild(draggedItem);
            }
        });
    }

    // Close the modal
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    
    function openEditTaskModal(task, row) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Edit Task';
    
        // Populate the form fields with the existing task data
        document.getElementById('taskName').value = task.taskName;
        document.getElementById('taskType').value = task.taskType;
        document.getElementById('priority').value = task.priority;
        document.getElementById('tags').value = task.taskTags;
        document.getElementById('storyPoints').value = task.storyPoints;
        document.getElementById('sprint').value = task.sprint;
        document.getElementById('taskDescription').value = task.taskDescription;
        document.getElementById('stage').value = task.stage;
        document.getElementById('taskMember').value = task.taskMember;
    
        // When submitting the form, update the task object and localStorage
        taskForm.onsubmit = (event) => {
            event.preventDefault();
    
            // Update task properties based on the edited form fields
            task.taskName = document.getElementById('taskName').value;
            task.taskType = document.getElementById('taskType').value;
            task.priority = document.getElementById('priority').value;
            task.taskTags = document.getElementById('tags').value;
            task.storyPoints = document.getElementById('storyPoints').value;
            task.sprint = document.getElementById('sprint').value;
            task.taskDescription = document.getElementById('taskDescription').value;
            task.stage = document.getElementById('stage').value;
            task.taskMember = document.getElementById('taskMember').value;
    
            // Save updated task data to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
    
            // Update the task row in the table with new data
            renderKanbanBoard(tasks)
    
            // Hide the modal after saving the changes
            modal.style.display = 'none';
        };
    }


    // Select the Complete Sprint button
    const completeSprintButton = document.getElementById('completeSprintButton');

    let sprints = JSON.parse(localStorage.getItem('sprints')) || [];
    const sprintToUpdate = sprints.find(sprint => sprint.sprintName === sprintName);

    if (sprintToUpdate.status === 'Completed') {
        completeSprintButton.innerHTML = 'Sprint Completed'
    }

    // Add event listener for the Complete Sprint button
    completeSprintButton.addEventListener('click', function () {
        completeSprintButton.innerHTML = 'Sprint Completed'
        
        // Retrieve all tasks in the sprint
        const incompleteTasks = sprintTasks.filter(task => task.status !== 'Completed');
        incompleteTasks.forEach(task => {
            task.status = 'Not Started'
        })
        
        // Retrieve the existing product backlog tasks from localStorage
        let backlogTasks = JSON.parse(localStorage.getItem('tasks'));

        // Move incomplete tasks to the backlog
        backlogTasks = backlogTasks.concat(incompleteTasks);

        // Save updated backlog tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(backlogTasks));

        // Remove the incomplete tasks from the sprint
        const updatedSprintTasks = sprintTasks.filter(task => task.status === 'Completed');

        // Update the kanbanBoardItems for this sprint
        kanbanBoardItems[sprintName] = updatedSprintTasks;
        localStorage.setItem('kanbanBoardItems', JSON.stringify(kanbanBoardItems));

        // Optional: Update the sprints data to reflect the change
        let sprints = JSON.parse(localStorage.getItem('sprints')) || [];
        const sprintToUpdate = sprints.find(sprint => sprint.sprintName === sprintName);

        sprintToUpdate.status = 'Completed'

        if (sprintToUpdate) {
            sprintToUpdate.selectedPBIS = updatedSprintTasks;
            localStorage.setItem('sprints', JSON.stringify(sprints));
        }

        // Re-render the Kanban board with updated tasks
        renderKanbanBoard(updatedSprintTasks);

         // Make all items in the 'Completed' column undraggable
        const completedTasks = document.querySelectorAll('#Completed li');
        completedTasks.forEach(task => {
            task.setAttribute('draggable', 'false'); // Disable dragging
            task.classList.add('disabled-task'); // Optional: Add a class to style the disabled tasks
        });

        console.log('Incomplete tasks have been moved back to the product backlog.');
    });


    // Function to render the Kanban board with task categorization
    function renderKanbanBoard(tasks) {
        // Clear previous tasks in each status list
        notStartedList.innerHTML = '';
        activeList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('li'); // Create an individual task element
            taskElement.textContent = task.taskName; // Display the task name
            
                // Add click event to open the edit modal
            taskElement.addEventListener('click', function() {
                const row = taskElement; // You might need to adjust how you reference the row
                openEditTaskModal(task, row);
            });
            
            // Add draggable functionality
            itemDraggable(taskElement);

            // Append to the appropriate column based on status
            if (task.status === 'Not Started') {
                notStartedList.appendChild(taskElement);
            } else if (task.status === 'In Progress') {
                activeList.appendChild(taskElement);
            } else if (task.status === 'Completed') {
                completedList.appendChild(taskElement);
            }
        });
    }

    // Call the render function when the page loads
    renderKanbanBoard(sprintTasks);


    // Custom multiselect logic
    var selectedItems = document.getElementById('selectedItems');
    var optionsContainer = document.getElementById('optionsContainer');
    var pbiInput = document.getElementById('pbi');

    // dropdown boxes for each task 
    tasks.forEach(function(task) {
        var pbi = document.createElement('div');
        pbi.innerHTML = `<label><span>${task.taskName}</span><input type="checkbox" value='${JSON.stringify(task)}'></label>`;
        console.log(JSON.stringify(task));
        optionsContainer.append(pbi);
    });

    // Attach the event listener to the entire select-box
    document.querySelector('.select-box').addEventListener('click', function() {
        optionsContainer.style.display = optionsContainer.style.display === 'none' || optionsContainer.style.display === '' ? 'block' : 'none';
        // Rotate the caret when dropdown is opened
        document.querySelector('.caret-down').style.transform = optionsContainer.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0deg)';
    });


    // Update selected product backlog items (pbis)
    optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var selectedOptions = Array.from(optionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(option => JSON.parse(option.value).taskName);
            selectedItems.innerText = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Product Backlog Items';
            pbiInput.value = selectedOptions.join(', '); // Update the hidden input field for form submission
        });
    });

    // Logic to show admin menu in header
    if (localStorage.getItem('isAdminLoggedIn')) {
        const nav = document.getElementById('nav');
        nav.innerHTML = `
        <a href="../Sprint Backlog Page/sprintbacklog.html">Sprint Backlog</a>
        <a href="../Product Backlog Page/productbacklogpage.html">Product Backlog</a>
        <span id="adminLink">
        <a href="../Admin Page/adminmenu.html">Admin Menu</a>
        </span>
        <button class="logout-button" id="logoutButton">Logout</button>
        `;
    }

});