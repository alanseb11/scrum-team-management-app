document.addEventListener('DOMContentLoaded', function() {
    const sprintTableBody = document.getElementById('sprintTableBody');
    const addSprintButton = document.getElementById('addSprintButton');
    const modal = document.getElementById('sprintModal');
    const closeButton = document.querySelector('.close');
    const sprintForm = document.getElementById('sprintForm');
    
    // Get tasks from localStorage (where you save the tasks)
    const productBacklog = JSON.parse(localStorage.getItem('tasks')) || [];

    // Retrieve sprint data from localStorage or set initial data
    const sprints = JSON.parse(localStorage.getItem('sprints')) || [];

    // Open the modal to add a new sprint
    addSprintButton.addEventListener('click', () => {
        modal.style.display = 'block';
        sprintForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Sprint';
        sprintForm.onsubmit = handleAddSprint;
        populatePbiOptions(); // Populate PBIs from the tasks when opening the modal
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
        sprintTableBody.appendChild(row);

        // Add an event listener to the row for the click event
        row.addEventListener('click', () => {
            window.location.href = `../Kanban Board/kanbanboard.html`;
        });

        // Attach edit and delete functionality
        row.querySelector('.editButton').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSprintModal(sprint, row);
        });
        row.querySelector('.deleteButton').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSprint(row, sprint);
        });
    }

    // Handle adding a new sprint
    function handleAddSprint(event) {
        event.preventDefault();

        const sprintName = document.getElementById('sprintName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('status').value;

        // Get selected PBIs
        const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
        const selectedPBIs = selectedCheckboxes.map(cb => JSON.parse(cb.value).taskName);

        if (!dateValidation()) return;

        const newSprint = { sprintName, startDate, endDate, status, selectedPBIs };
        sprints.push(newSprint);
        localStorage.setItem('sprints', JSON.stringify(sprints));

        addSprintToTable(newSprint);
        modal.style.display = 'none';
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

    // Open the modal to edit a sprint
    function openEditSprintModal(sprint, row) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Edit Sprint';
        document.getElementById('sprintName').value = sprint.sprintName;
        document.getElementById('startDate').value = sprint.startDate;
        document.getElementById('endDate').value = sprint.endDate;
        document.getElementById('status').value = sprint.status;
        
        populatePbiOptions(sprint.selectedPBIS);

        sprintForm.onsubmit = (event) => {
            event.preventDefault();
            sprint.sprintName = document.getElementById('sprintName').value;
            sprint.startDate = document.getElementById('startDate').value;
            sprint.endDate = document.getElementById('endDate').value;
            sprint.status = document.getElementById('status').value;

            // Get selected PBIs
            const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
            sprint.selectedPBIS = selectedCheckboxes.map(cb => JSON.parse(cb.value).taskName);

            localStorage.setItem('sprints', JSON.stringify(sprints));

            // Update table row
            row.cells[0].textContent = sprint.sprintName;
            row.cells[1].textContent = sprint.status;

            modal.style.display = 'none';
        };
    }

    // Populate PBIs into the multiselect options from the tasks stored in localStorage
    function populatePbiOptions(selectedPBIS = []) {
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = ''; // Clear previous options

        // Iterate over tasks stored in localStorage under 'tasks'
        productBacklog.forEach(task => {
            const isChecked = selectedPBIS.includes(task.taskName) ? 'checked' : '';
            const pbiDiv = document.createElement('div');
            pbiDiv.innerHTML = `
                <label>
                    <span>${task.taskName}</span>
                    <input type="checkbox" value='${JSON.stringify(task)}' ${isChecked}>
                </label>
            `;
            optionsContainer.appendChild(pbiDiv);
        });

        // Update selected items
        optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
            checkbox.addEventListener('change', updateSelectedItems);
        });
    }

    // Update the selected items display
    function updateSelectedItems() {
        const selectedCheckboxes = Array.from(document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked'));
        const selectedNames = selectedCheckboxes.map(cb => JSON.parse(cb.value).taskName);
        const selectedItems = document.getElementById('selectedItems');
        selectedItems.innerText = selectedNames.length > 0 ? selectedNames.join(', ') : 'Select Product Backlog Items';
    }

    // Delete a sprint
    function deleteSprint(row, sprint) {
        const index = sprints.indexOf(sprint);
        sprints.splice(index, 1);
        localStorage.setItem('sprints', JSON.stringify(sprints));
        row.remove();
    }

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

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('isUserLoggedIn');
            window.location.href = "../Login Page/loginpage.html";
        });
    }

    renderSprints();
    
    // Handle dropdown toggle for PBIs
    document.querySelector('.select-box').addEventListener('click', function() {
        const optionsContainer = document.getElementById('optionsContainer');
        const isDisplayed = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isDisplayed ? 'none' : 'block';

        // Rotate caret
        document.querySelector('.caret-down').style.transform = isDisplayed ? 'rotate(0deg)' : 'rotate(180deg)';
    });
});
