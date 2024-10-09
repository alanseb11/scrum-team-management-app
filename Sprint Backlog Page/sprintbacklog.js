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
        row.innerHTML = `
            <td>${sprint.sprintName}</td>
            <td>${sprint.status}</td>
            <td>
                <button class="startSprintButton">Start</button>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;
        
        // Add an event listener to the row for the click event
        row.addEventListener('click', () => {
            // Redirect to the page you want when the row is clicked
            window.location.href = `../Kanban Board/kanbanboard.html`;
        });
        sprintTableBody.appendChild(row);

        // Attach edit functionality
        row.querySelector('.editButton').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSprintModal(sprint, row);
        });

        // Attach delete functionality
        row.querySelector('.deleteButton').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSprint(row, sprint);
        });
    
        // Add event listener for the Start button
        row.querySelector('.startSprintButton').addEventListener('click', (e) => {
            e.stopPropagation();
            handleStartSprint(sprint);  // Pass the sprint to the handler function
        });
    }

// Ensure that tasks are saved as full objects, not just names
function handleAddSprint(event) {
    event.preventDefault();
    const sprintName = document.getElementById('sprintName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('status').value;

    // Get selected PBIs as full objects
    const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
    const selectedPBIs = selectedCheckboxes.map(cb => JSON.parse(cb.value)); // Full task objects

    if (!dateValidation()) return;

    // Find the sprint if it already exists and append to its tasks
    let existingSprint = sprints.find(sprint => sprint.sprintName === sprintName);
    if (existingSprint) {
        // Append the new PBIs to the existing ones (ensure no duplicates)
        existingSprint.selectedPBIS = [...new Set([...existingSprint.selectedPBIS, ...selectedPBIs])];
    } else {
        // Create a new sprint and add it to the list
        const newSprint = { sprintName, startDate, endDate, status, selectedPBIS: selectedPBIs };
        sprints.push(newSprint);
    }

    // Remove allocated tasks from product backlog
    productBacklog = productBacklog.filter(task => !selectedPBIs.some(pbi => pbi.taskName === task.taskName));

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
    document.getElementById('status').value = sprint.status;

    // Populate the PBIs with the ones that are already selected for the sprint
    populatePbiOptions(sprint.selectedPBIS);

    sprintForm.onsubmit = (event) => {
        event.preventDefault();
        sprint.sprintName = document.getElementById('sprintName').value;
        sprint.startDate = document.getElementById('startDate').value;
        sprint.endDate = document.getElementById('endDate').value;
        sprint.status = document.getElementById('status').value;

        // Get selected PBIs as full objects
        const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
        const newSelectedPBIS = selectedCheckboxes.map(cb => JSON.parse(cb.value));

        // Combine and remove duplicates
        sprint.selectedPBIS = [...new Set([...sprint.selectedPBIS, ...newSelectedPBIS])];

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



    // Populate PBIs from the product backlog into the multiselect options
    function populatePbiOptions(selectedPBIS = []) {
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = ''; // Clear previous options

        // Get available tasks that are not in any sprint
        const availableTasks = productBacklog;

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
        sprint.status = 'In Progress';
    
        // Log the PBIs for debugging
        console.log("Starting sprint with PBIs:", sprint.selectedPBIS);
    
        // Retrieve existing kanbanBoardItems from localStorage or initialize it if it doesn't exist
        let kanbanBoardItems = JSON.parse(localStorage.getItem('kanbanBoardItems')) || {};
    
        // Add the selectedPBIS for the current sprint to the kanbanBoardItems
        kanbanBoardItems[sprint.sprintName] = sprint.selectedPBIS;
    
        // Save the updated kanbanBoardItems to localStorage
        localStorage.setItem('kanbanBoardItems', JSON.stringify(kanbanBoardItems));
    
        // Redirect to the Kanban board page with the sprint name as a query parameter
        window.location.href = `../Kanban Board/kanbanboard.html?sprintName=${encodeURIComponent(sprint.sprintName)}`;
    
        // Re-render the sprints table to reflect the status change
        renderSprints();
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
        <a href="../Home Page/homepage.html">Home</a>
        <a href="../Product Backlog Page/productbacklogpage.html">Product Backlog</a>
        <a href="../Sprint Backlog Page/sprintbacklog.html">Sprint Backlog</a>
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


