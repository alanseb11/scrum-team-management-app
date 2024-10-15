document.addEventListener('DOMContentLoaded', function() {
    // Get the sprint name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sprintName = urlParams.get('sprintName');
    const closeButton = document.querySelector('.close');
    
    const taskForm = document.getElementById('taskForm');
    const modal = document.getElementById('taskModal');
    
    // Retrieve the kanbanBoardItems from localStorage
    let kanbanBoardItems = JSON.parse(localStorage.getItem('kanbanBoardItems')) || {};

    // Get the tasks associated with the specific sprint
    let sprintTasks = kanbanBoardItems[sprintName] || [];

    // Getting sprint columns
    const notStartedList = document.getElementById('Not Started');
    const activeList = document.getElementById('In Progress');
    const completedList = document.getElementById('Completed');

    const lists = document.querySelectorAll('.draggable-list');
    let draggedItem = null;

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

    // Function to render the Kanban board with tasks categorized by status
    function renderKanbanBoard(tasks) {
        // Clear previous tasks in each status list
        notStartedList.innerHTML = '';
        activeList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.textContent = task.taskName;

            // Add click event to open the edit modal
            taskElement.addEventListener('click', function() {
                openEditTaskModal(task, sprintName);
            });

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

    // Initial rendering of the Kanban board
    renderKanbanBoard(sprintTasks);

    // Event listener to add a new time entry row in the modal
    document.getElementById('addTimeEntryButton').addEventListener('click', function(){
        addTimeEntryRow();
    });

    // Add logic for drag-and-drop functionality and other features as needed...
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




    