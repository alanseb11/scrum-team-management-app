document.addEventListener('DOMContentLoaded', function () {
    const sprintTableBody = document.getElementById('sprintTableBody');
    const addSprintButton = document.getElementById('addSprintButton');
    const modal = document.getElementById('sprintModal');
    const closeButton = document.querySelector('.close');
    const sprintForm = document.getElementById('sprintForm');

    // Get product backlog and sprint data from localStorage
    let productBacklog = JSON.parse(localStorage.getItem('tasks')) || [];
    let sprints = JSON.parse(localStorage.getItem('sprints')) || [];

    // Open modal to add a new sprint
    addSprintButton.addEventListener('click', () => {
        modal.style.display = 'block';
        sprintForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Sprint';
        sprintForm.onsubmit = handleAddSprint;
        populatePbiOptions(); // Populate PBIs from the product backlog
    });

    // Close the modal
    closeButton.addEventListener('click', () => modal.style.display = 'none');

    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Render sprints stored in localStorage
    function renderSprints() {
        sprintTableBody.innerHTML = ''; // Clear table before rendering
        sprints.forEach(sprint => addSprintToTable(sprint));
    }

    // Add a sprint to the table
    function addSprintToTable(sprint) {
        const row = document.createElement('tr');
        if (!sprint.hasSprintStarted) {
        row.innerHTML = `
            <td>${sprint.sprintName}</td>
            <td>${sprint.status}</td>
            <td>
                <button class="startSprintButton">Start</button>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;
        // Attach edit functionality
        row.querySelector('.editButton').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSprintModal(sprint, row);
        });

        // Add event listener for the Start button
        row.querySelector('.startSprintButton').addEventListener('click', (e) => {
            e.stopPropagation();
            handleStartSprint(sprint);  // Pass the sprint to the handler function
        });

        } else {
            row.innerHTML = `
            <td>${sprint.sprintName}</td>
            <td>${sprint.status}</td>
            <td>
                <button class="viewButton">View</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;
        // Add event listener for the Start button
        row.querySelector('.viewButton').addEventListener('click', (e) => {
            e.stopPropagation();
            handleViewSprint(sprint);  // Pass the sprint to the handler function
        });
        }
        
        // Add an event listener to the row for the click event
        row.addEventListener('click', () => {
            // Redirect to the page you want when the row is clicked
            window.location.href = `../Kanban Board/kanbanboard.html`;
        });
        sprintTableBody.appendChild(row);


        // Attach delete functionality
        row.querySelector('.deleteButton').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSprint(row, sprint);
        });
    
    }

    function handleAddSprint(event) {
        event.preventDefault();
        const sprintName = document.getElementById('sprintName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = 'Not Started';
        let hasSprintStarted = false;
    
        // Get selected PBIs as full objects
        const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
        const newSelectedPBIS = selectedCheckboxes.map(cb => JSON.parse(cb.value)); // Full task objects
    
        if (!dateValidation()) return;
    
        // Find the sprint if it already exists
        let existingSprint = sprints.find(sprint => sprint.sprintName === sprintName);
        if (existingSprint) {
            // Handle task removal: add unselected tasks back to product backlog
            const removedTasks = existingSprint.selectedPBIS.filter(task => !newSelectedPBIS.some(newTask => newTask.taskName === task.taskName));
            productBacklog.push(...removedTasks);
    
            // Remove duplicates in the product backlog
            productBacklog = [...new Set(productBacklog.map(task => JSON.stringify(task)))].map(task => JSON.parse(task));
    
            // Update the sprint's selected PBIS
            existingSprint.selectedPBIS = newSelectedPBIS;
        } else {
            // Create a new sprint and add it to the list
            const newSprint = { sprintName, startDate, endDate, status, selectedPBIS: newSelectedPBIS, hasSprintStarted };
            sprints.push(newSprint);
            console.log(newSprint)
        }
    
        // Remove newly selected tasks from the product backlog
        productBacklog = productBacklog.filter(task => !newSelectedPBIS.some(pbi => pbi.taskName === task.taskName));
    
        // Save updates to localStorage
        localStorage.setItem('tasks', JSON.stringify(productBacklog));
        localStorage.setItem('sprints', JSON.stringify(sprints));
        renderSprints();
        modal.style.display = 'none';
    }
    
    
    

    function openEditSprintModal(sprint, row) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Edit Sprint';
        document.getElementById('sprintName').value = sprint.sprintName;
        document.getElementById('startDate').value = sprint.startDate;
        document.getElementById('endDate').value = sprint.endDate;
    
        // Populate the PBIs with the ones that are already selected for the sprint
        populatePbiOptions(sprint.selectedPBIS);
    
        sprintForm.onsubmit = (event) => {
            event.preventDefault();
            sprint.sprintName = document.getElementById('sprintName').value;
            sprint.startDate = document.getElementById('startDate').value;
            sprint.endDate = document.getElementById('endDate').value;
    
            // Get selected PBIs as full objects
            const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
            const newSelectedPBIS = selectedCheckboxes.map(cb => JSON.parse(cb.value));
    
            // Handle task removal: add unselected tasks back to product backlog
            const removedTasks = sprint.selectedPBIS.filter(task => !newSelectedPBIS.some(newTask => newTask.taskName === task.taskName));
            productBacklog.push(...removedTasks);
    
            // Remove duplicates in the product backlog
            productBacklog = [...new Set(productBacklog.map(task => JSON.stringify(task)))].map(task => JSON.parse(task));
    
            // Replace the sprint's selectedPBIS with the newly selected PBIS (no duplicates)
            sprint.selectedPBIS = newSelectedPBIS;
    
            // Remove allocated tasks from product backlog
            productBacklog = productBacklog.filter(task => !sprint.selectedPBIS.some(pbi => pbi.taskName === task.taskName));
    
            // Save changes to localStorage
            localStorage.setItem('tasks', JSON.stringify(productBacklog));
            localStorage.setItem('sprints', JSON.stringify(sprints));
    
            // Update table row
            row.cells[0].textContent = sprint.sprintName;
            row.cells[1].textContent = sprint.status;
    
            modal.style.display = 'none';
        };
    }
    
    

function getAvailableTasksForSprint(selectedPBIS = []) {
    // First, ensure the tasks in the current sprint are available for selection
    const selectedTasksFromSprint = selectedPBIS.map(pbi => pbi.taskName);
    
    // Get all tasks currently allocated to any sprint
    const allocatedTasks = sprints.flatMap(sprint => sprint.selectedPBIS.map(pbi => pbi.taskName));

    // Return tasks that are either not allocated to any sprint OR are in the current sprint's PBIS
    return [...productBacklog, ...selectedPBIS].filter(task => 
        !allocatedTasks.includes(task.taskName) || selectedTasksFromSprint.includes(task.taskName)
    );
}


    function populatePbiOptions(selectedPBIS = []) {
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = ''; // Clear previous options

        // Get available tasks that are not in any sprint or are in the current sprint
        const availableTasks = getAvailableTasksForSprint(selectedPBIS);

        availableTasks.forEach(task => {
            const isChecked = selectedPBIS.some(pbi => pbi.taskName === task.taskName) ? 'checked' : '';
            const pbiDiv = document.createElement('div');
            pbiDiv.innerHTML = `
                <label>
                    <span>${task.taskName}</span>
                    <input type="checkbox" value='${JSON.stringify(task)}' ${isChecked}>
                </label>
            `;
            optionsContainer.appendChild(pbiDiv);
        });
    }


    // Delete a sprint and return tasks to the product backlog
    function deleteSprint(row, sprint) {
        const index = sprints.indexOf(sprint);
        if (index > -1) {
            // Return sprint tasks to product backlog
            productBacklog.push(...sprint.selectedPBIS);
            sprints.splice(index, 1);

            // Save changes to localStorage
            localStorage.setItem('tasks', JSON.stringify(productBacklog));
            localStorage.setItem('sprints', JSON.stringify(sprints));

            // Remove sprint row
            row.remove();
        }
    }

    function handleStartSprint(sprint) {
        // Change the sprint status to 'In Progress'
        if (sprint.status === 'Completed') {
            sprint.status = 'Completed';
        } else {
            sprint.status = 'In Progress'
        }
        
        // Log the PBIs for debugging
        console.log("Starting sprint with PBIs:", sprint.selectedPBIS);
    
        // Retrieve existing kanbanBoardItems from localStorage or initialize it if it doesn't exist
        let kanbanBoardItems = JSON.parse(localStorage.getItem('kanbanBoardItems')) || {};
    
        // Add the selectedPBIS for the current sprint to the kanbanBoardItems
        kanbanBoardItems[sprint.sprintName] = sprint.selectedPBIS;

        sprint.hasSprintStarted = true;

        // Save the updated kanbanBoardItems to localStorage
        localStorage.setItem('kanbanBoardItems', JSON.stringify(kanbanBoardItems));

        // Save the updated sprint status to localStorage
        localStorage.setItem('sprints', JSON.stringify(sprints));
                
        // Re-render the sprints table to reflect the status change
        renderSprints();
    }

    function handleViewSprint(sprint) {
        // Redirect to the Kanban board page with the sprint name as a query parameter
        window.location.href = `../Kanban Board/kanbanboard.html?sprintName=${encodeURIComponent(sprint.sprintName)}`;
    }
    

    // Validate the sprint dates
    function dateValidation() {
        const startDateError = document.getElementById('startDateError');
        const endDateError = document.getElementById('endDateError');
        startDateError.textContent = '';
        endDateError.textContent = '';

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const currentDate = new Date().toISOString().split('T')[0];

        if (startDate < currentDate) {
            startDateError.textContent = 'Invalid start date. Start date must not be in the past.';
            return false;
        }

        if (endDate < startDate) {
            endDateError.textContent = 'Invalid end date. End date must be after start date.';
            return false;
        }

        return true;
    }

    renderSprints();

    // Handle dropdown toggle for PBIs
    document.querySelector('.select-box').addEventListener('click', function () {
        const optionsContainer = document.getElementById('optionsContainer');
        const isDisplayed = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isDisplayed ? 'none' : 'block';

        // Rotate caret
        document.querySelector('.caret-down').style.transform = isDisplayed ? 'rotate(0deg)' : 'rotate(180deg)';
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
            console.log('clicked')
            // Clear login status from localStorage
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('isUserLoggedIn');
            // Redirect to login page
            window.location.href = "../Login Page/loginpage.html";
        });
    }
});

//localStorage.clear();




