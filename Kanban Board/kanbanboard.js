// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the sprint name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sprintName = urlParams.get('sprintName');
    var closeButton = document.querySelector('.close');
    const taskForm = document.getElementById('taskForm');
    const modal = document.getElementById('taskModal');
    
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

        // Helper function to add time entry rows
    function addTimeEntryRow(dateWorkedOn = '', hoursWorked = '') {
        const timeEntriesDiv = document.getElementById('timeEntries');
        const entryRow = document.createElement('div');
        entryRow.classList.add('time-entry-row');
    
        entryRow.innerHTML = `
            <input type="date" class="date-worked-on" value="${dateWorkedOn}" required>
            <input type="number" class="hours-worked" value="${hoursWorked}" min="0" placeholder="Hours worked" required>
            <button type="button" class="removeTimeEntryButton">Remove</button>
        `;
    
        // Add remove functionality for each time entry
        entryRow.querySelector('.removeTimeEntryButton').addEventListener('click', function() {
            timeEntriesDiv.removeChild(entryRow);
        });
    
        timeEntriesDiv.appendChild(entryRow);
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Add event listener for the close button
    closeButton.addEventListener('click', closeModal);

    // Add event listener for clicking outside the modal
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    
    // Function to open the task edit modal
    function openEditTaskModal(task, sprintName) {
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

        // Clear existing time entries and add them based on task data
        const timeEntriesDiv = document.getElementById('timeEntries');
        timeEntriesDiv.innerHTML = '';
        if (task.timeTracking && task.timeTracking.length > 0) {
            task.timeTracking.forEach(entry => addTimeEntryRow(entry.dateWorkedOn, entry.hoursWorked));
        }

        // When submitting the form, update the task object and localStorage
        taskForm.onsubmit = (event) => {
            event.preventDefault();

            // Find the correct task in sprintTasks by matching the taskName
            const taskIndex = sprintTasks.findIndex(t => t.taskName === task.taskName);
    
            if (taskIndex !== -1) {
                // Update the specific task's properties based on the edited form fields
                sprintTasks[taskIndex].taskName = document.getElementById('taskName').value;
                sprintTasks[taskIndex].taskType = document.getElementById('taskType').value;
                sprintTasks[taskIndex].priority = document.getElementById('priority').value;
                sprintTasks[taskIndex].taskTags = document.getElementById('tags').value;
                sprintTasks[taskIndex].storyPoints = document.getElementById('storyPoints').value;
                sprintTasks[taskIndex].sprint = document.getElementById('sprint').value;
                sprintTasks[taskIndex].taskDescription = document.getElementById('taskDescription').value;
                sprintTasks[taskIndex].stage = document.getElementById('stage').value;
                sprintTasks[taskIndex].taskMember = document.getElementById('taskMember').value;
    
                // Collect time entries
                const timeEntries = [];
                document.querySelectorAll('.time-entry-row').forEach(row => {
                    const dateWorkedOn = row.querySelector('.date-worked-on').value;
                    const hoursWorked = row.querySelector('.hours-worked').value;
                    if (dateWorkedOn && hoursWorked) {
                        timeEntries.push({ dateWorkedOn, hoursWorked: parseFloat(hoursWorked) });
                    }
                });
                sprintTasks[taskIndex].timeTracking = timeEntries;
        
                // Save updated sprintTasks back to localStorage
                kanbanBoardItems[sprintName] = sprintTasks; // Update tasks for the current sprint
                localStorage.setItem('kanbanBoardItems', JSON.stringify(kanbanBoardItems));
    
                // Re-render the Kanban board with the updated task
                renderKanbanBoard(sprintTasks);
    
                // Hide the modal after saving the changes
                modal.style.display = 'none';
            }
        };
    }

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
            
            taskElement.addEventListener('click', function() {
                openEditTaskModal(task, sprintName);
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


    document.getElementById('addTimeEntryButton').addEventListener('click', function(){
        addTimeEntryRow();
    });
    
    // Handle form submission (Add new sprint)
    function addSprint(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        var sprintName = document.getElementById('sprintName').value;
        var startDate = document.getElementById('startDate').value;
        var endDate = document.getElementById('endDate').value;
        var status = document.getElementById('status').value;
        var selectedPBIS = document.getElementById('customMultiselect').value; 
        
        // date validation
        var startDateError = document.getElementById('startDateError');
        var endDateError = document.getElementById('endDateError');
        startDateError.textContent = ''
        endDateError.textContent = ''

        // get current date
        const date = new Date(); 
        let currentDate = date.toJSON();

        if (startDate < currentDate.slice(0,10)) {
            startDateError.textContent = 'Invalid start date. Start date must not be in the past.'
            return;
        } else { 
            startDateError.textContent = ''
        }

        if (endDate < startDate) {
            endDateError.textContent = 'Invalid end date. End date must be after start date.'
            return;
        } else { 
            endDateError.textContent = ''
        }


        // Store sprint in the centralized array
        var newSprintData = {
            sprintName: sprintName, 
            startDate: startDate,
            endDate: endDate,
            status: status,
            selectedPBIS: selectedPBIS
        }
        var newSprintDraggable = document.createElement('li')
        newSprintDraggable.innerHTML = `<button class="editSprintButton">${sprintName}</button></td>`;

        newSprintDraggable.setAttribute('name', sprintName);
        newSprintDraggable.setAttribute('start-date', startDate);
        newSprintDraggable.setAttribute('end-date', endDate);
        newSprintDraggable.setAttribute('status', status);

        sprints.push(newSprintData);
        originalSprints.push(newSprintData); // Update the original sprint list

        localStorage.setItem('sprints', JSON.stringify(sprints));

        itemDraggable(newSprintDraggable);

        // adding new sprint to column 
        if (status == 'not-started') { 
            // append sprint to column
            notStartedList.append(newSprintDraggable)

        } else if (status == 'in-progress') {
            activeList.append(newSprintDraggable)

        } else {
            completedList.append(newSprintDraggable)
            
        }

        // attach event listener to new sprint
        attachSprintEventListeners(newSprintDraggable,sprints.length-1);

        // // Re-render both views after adding the sprint
        // renderListView();
        // renderCardView();

        // Reset the form
        sprintForm.reset();

        // Close the modal
        modal.style.display = 'none';
    };

    // edit sprint functionality 
    // Attach event listeners to new sprints
    function attachSprintEventListeners(sprint, sprintIndex) {
        var editSprintButton = sprint.querySelector('.editSprintButton');
    
        editSprintButton.addEventListener('click', function() {
            // Open the modal and populate the form with the task details
            modal.style.display = 'block';
            document.getElementById('sprintName').value = sprints[sprintIndex].sprintName;
            document.getElementById('startDate').value = sprints[sprintIndex].startDate;
            document.getElementById('endDate').value = sprints[sprintIndex].endDate;
            document.getElementById('status').value = sprints[sprintIndex].status;
            document.getElementById('customMultiselect').value = sprints[sprintIndex].selectedPBIS;

            // Update form submission to save changes
            sprintForm.onsubmit = function(event) {
                event.preventDefault(); // Prevent default form submission

                // Update sprint details in the sprint array
                sprints[sprintIndex] = {
                    sprintName: document.getElementById('sprintName').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                    status: document.getElementById('status').value,
                    selectedPBIS: document.getElementById('customMultiselect').value    
                };

                // updates sprint name if modified 
                sprint.querySelector('.editSprintButton').innerText = sprints[sprintIndex].sprintName; 

                var sprintToEdit = sprints[sprintIndex]
                var originalIndex = originalSprints.findIndex(sprint => sprint.sprintName === sprintToEdit.sprintName && sprint.startDate === sprintToEdit.sprintDate);
                if (originalIndex !== -1) {
                    originalSprints[originalIndex] = { ...sprints[sprintIndex] };
                }

                // // Re-render both views
                // renderListView();
                // renderCardView();
                sprintForm.reset();

                // Close the modal
                modal.style.display = 'none';
            };
        });
    }

    var originalSprints = [...sprints]; // Keep a copy of the original task list


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