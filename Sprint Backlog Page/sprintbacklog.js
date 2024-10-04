document.addEventListener('DOMContentLoaded', function() {
    const sprintTableBody = document.getElementById('sprintTableBody');
    const addSprintButton = document.getElementById('addSprintButton');
    const modal = document.getElementById('sprintModal');
    const closeButton = document.querySelector('.close');
    const sprintForm = document.getElementById('sprintForm');

    // Sprint data
    const sprints = JSON.parse(localStorage.getItem('sprints')) || [
        {
            sprintName: 'Example Sprint 1', 
            startDate: '2024-10-10',
            endDate: '2024-10-30',
            status: 'Not Started',
            selectedPBIS: 'Example Task 1'
        }
    ];
    
    // Open the modal to add a new sprint
    addSprintButton.addEventListener('click', () => {
        modal.style.display = 'block';
        sprintForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Sprint';
        sprintForm.onsubmit = handleAddSprint;
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

        // Attach edit and delete functionality
        row.querySelector('.editButton').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the row
            openEditSprintModal(sprint, row);
        });
        row.querySelector('.deleteButton').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the row
            deleteSprint(row, sprint);
        });
    }


    function handleAddSprint(event) {
        event.preventDefault();

        const sprintName = document.getElementById('sprintName').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('status').value;

        dateValidation();

        const newSprint = { sprintName, startDate, endDate, status };
        sprints.push(newSprint);
        localStorage.setItem('sprints', JSON.stringify(sprints));

        addSprintToTable(newSprint);
        modal.style.display = 'none';
    }


    function dateValidation() {
        // date validation
        const startDateError = document.getElementById('startDateError');
        const endDateError = document.getElementById('endDateError');
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
    }

    // Open the edit modal
    function openEditSprintModal(sprint, row) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Edit Sprint';
        document.getElementById('sprintName').value = sprint.sprintName;
        document.getElementById('startDate').value = sprint.startDate;
        document.getElementById('endDate').value = sprint.endDate;
        document.getElementById('status').value = sprint.status;

        sprintForm.onsubmit = (event) => {
            event.preventDefault();
            sprint.sprintName = document.getElementById('sprintName').value;
            sprint.startDate = document.getElementById('startDate').value;
            sprint.endDate = document.getElementById('endDate').value;
            sprint.status = document.getElementById('status').value;
            localStorage.setItem('sprints', JSON.stringify(sprints));

            // Update table row
            row.cells[0].textContent = sprint.sprintName;
            row.cells[1].textContent = sprint.status;

            modal.style.display = 'none';
        };
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

    renderSprints();

});


    /* // Custom multiselect logic
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
    }); */