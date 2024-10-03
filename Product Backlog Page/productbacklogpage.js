document.addEventListener('DOMContentLoaded', function() {


    //Adding the logout functionality
    if (localStorage.getItem('isAdminLoggedIn') !== 'true' && localStorage.getItem('isUserLoggedIn') !== 'true') {
        // If not logged in, redirect to the login page
        window.location.href = "../Login Page/loginpage.html";
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function() {
        // Clear login status from localStorage
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isUserLoggedIn');
        // Redirect to login page
        window.location.href = "../Login Page/loginpage.html";
    });


    var modal = document.getElementById('taskModal');
    var addRowButton = document.getElementById('addRowButton');
    var closeButton = document.querySelector('.close');
    var taskForm = document.getElementById('taskForm');
    var table = document.getElementById('productBacklogTable').getElementsByTagName('tbody')[0];
    var toggleViewButton = document.getElementById('toggleViewButton');
    var isListView = true;
    // Load tasks from local storage or initialize with predefined tasks
    var originalTasks = JSON.parse(localStorage.getItem('originalTasks')) || [
        {
            taskName: 'Example Task 1',
            taskType: 'Story',
            priority: 'Medium',
            tags: 'Frontend, API',
            sprint: 'Sprint 1',
            startDate: '2024-09-10',
            taskDescription: 'This is an example task',
            status: 'In Progress',
            stage: 'Planning',
            storyPoints: '5',
            taskMember: 'Lisa'
        },
        {
            taskName: 'Example Task 2',
            taskType: 'Bug',
            priority: 'Urgent',
            tags: 'Backend, Database',
            sprint: 'Sprint 2',
            startDate: '2024-09-11',
            taskDescription: 'This is another example task',
            status: 'Not Started',
            stage: 'Integration',
            storyPoints: '8',
            taskMember: 'Amar'
        }
    ];

    // Initialize tasks with the original list or predefined tasks if none exist in localStorage
    const tasks = JSON.parse(localStorage.getItem('originalTasks')) || [...originalTasks];

    const mainContainer = document.querySelector('.main-container');
    var cardViewContainer = document.createElement('div');
    cardViewContainer.classList.add('card-view');
    cardViewContainer.style.display = 'none'; // Start with card view hidden
    mainContainer.appendChild(cardViewContainer);

    // Custom multiselect logic
    var selectedItems = document.getElementById('selectedItems');
    var optionsContainer = document.getElementById('optionsContainer');
    var tagsInput = document.getElementById('tags');

    // Attach the event listener to the entire select-box
    document.querySelector('.select-box').addEventListener('click', function() {
        optionsContainer.style.display = optionsContainer.style.display === 'none' || optionsContainer.style.display === '' ? 'block' : 'none';
        // Rotate the caret when dropdown is opened
        document.querySelector('.caret-down').style.transform = optionsContainer.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0deg)';
    });


    // Update selected tags
    optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var selectedOptions = Array.from(optionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(option => option.value);
            selectedItems.innerText = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Tags';
            tagsInput.value = selectedOptions.join(', '); // Update the hidden input field for form submission
        });
    });

    // Show the modal
    addRowButton.onclick = function() {
        modal.style.display = 'block';
        // taskForm.onsubmit = addTask;
    };

    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Function to render tasks in the table (list view)
    function renderListView() {
        table.innerHTML = ''; // Clear the table first
        tasks.forEach(function(task, index) {
            var newRow = table.insertRow();
            newRow.insertCell(0).innerText = task.taskName;
            newRow.insertCell(1).innerText = task.priority;
            newRow.insertCell(2).innerText = task.tags;
            newRow.insertCell(3).innerText = task.storyPoints;
            var actionsCell = newRow.insertCell(4);
            actionsCell.innerHTML = "<button class='editButton'>Edit</button> <button class='deleteButton'>Delete</button>";
    
            attachRowEventListeners(newRow, index);
        });
    }

    // Function to render tasks in card view
    function renderCardView() {
        cardViewContainer.innerHTML = ''; // Clear existing cards
        tasks.forEach(function(task) {
            var card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${task.taskName}</h3>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Tags:</strong> ${task.tags}</p>
                <p><strong>Story Points:</strong> ${task.storyPoints}</p>
            `;
            cardViewContainer.appendChild(card);
        });
    }

    renderListView();

    // Handle form submission (Add new task)
    taskForm.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        var taskName = document.getElementById('taskName').value;
        var taskType = document.getElementById('taskType').value;
        var priority = document.getElementById('priority').value;
        var tags = tagsInput.value; // Updated to get the correct tags
        var sprint = document.getElementById('sprint').value;
        var startDate = document.getElementById('startDate').value;
        var taskDescription = document.getElementById('taskDescription').value;
        var status = document.getElementById('status').value;
        var stage = document.getElementById('stage').value;
        var storyPoints = document.getElementById('storyPoints').value;
        var taskMember = document.getElementById('taskMember').value;
        
        // date validation
        var startDateError = document.getElementById('startDateError');
        startDateError.textContent = ''

        // get current date
        const date = new Date(); 
        let currentDate = date.toJSON();

        if (startDate < currentDate.slice(0,10)) {
            startDateError.textContent = 'Invalid start date. Start date must not be in the past.'
            return;
        } else { 
            startDateError.textContent = ''
        }
        
        // Store task in the centralized array
        var newTask = {
            taskName,
            taskType,
            priority,
            tags,
            sprint,
            startDate,
            taskDescription,
            status,
            stage,
            storyPoints,
            taskMember
        };

        tasks.push(newTask);
        originalTasks.push(newTask); // Update the original task list

        localStorage.setItem('originalTasks', JSON.stringify(originalTasks));

        // Re-render both views after adding the task
        renderListView();
        renderCardView();

        // Reset the form
        taskForm.reset();
        selectedItems.innerText = 'Select Tags'; // Reset the custom multiselect text
        tagsInput.value = ''; // Reset the hidden tags input

        // Close the modal
        modal.style.display = 'none';
    };

    // Attach event listeners to new rows
    function attachRowEventListeners(row, taskIndex) {
        var editButton = row.querySelector('.editButton');
        var deleteButton = row.querySelector('.deleteButton');
    
        deleteButton.addEventListener('click', function() {
            var taskToDelete = tasks[taskIndex];
    
            // Remove the task from both tasks (filtered view) and originalTasks (full list)
            tasks.splice(taskIndex, 1); // Remove from filtered/visible tasks
            var originalIndex = originalTasks.findIndex(task => task.taskName === taskToDelete.taskName && task.startDate === taskToDelete.startDate);
            if (originalIndex !== -1) {
                originalTasks.splice(originalIndex, 1); // Remove from the full list
            }

            // Save the updated task list back to localStorage
            localStorage.setItem('originalTasks', JSON.stringify(originalTasks));

            // Re-render both views after deleting the task
            renderListView();
            renderCardView();
        });


        editButton.addEventListener('click', function() {
            // Open the modal and populate the form with the task details
            modal.style.display = 'block';
            document.getElementById('taskName').value = tasks[taskIndex].taskName;
            document.getElementById('taskType').value = tasks[taskIndex].taskType;
            document.getElementById('priority').value = tasks[taskIndex].priority;
            document.getElementById('tags').value = tasks[taskIndex].tags;
            document.getElementById('sprint').value = tasks[taskIndex].sprint;
            document.getElementById('startDate').value = tasks[taskIndex].startDate;
            document.getElementById('taskDescription').value = tasks[taskIndex].taskDescription;
            document.getElementById('status').value = tasks[taskIndex].status;
            document.getElementById('stage').value = tasks[taskIndex].stage;
            document.getElementById('storyPoints').value = tasks[taskIndex].storyPoints;
            document.getElementById('taskMember').value = tasks[taskIndex].taskMember;

            // Update form submission to save changes
            taskForm.onsubmit = function(event) {
                event.preventDefault(); // Prevent default form submission

                // Update task details in the tasks array
                tasks[taskIndex] = {
                    taskName: document.getElementById('taskName').value,
                    taskType: document.getElementById('taskType').value,
                    priority: document.getElementById('priority').value,
                    tags: tagsInput.value,
                    sprint: document.getElementById('sprint').value,
                    startDate: document.getElementById('startDate').value,
                    taskDescription: document.getElementById('taskDescription').value,
                    status: document.getElementById('status').value,
                    stage: document.getElementById('stage').value,
                    storyPoints: document.getElementById('storyPoints').value,
                    taskMember: document.getElementById('taskMember').value
                };

                var taskToEdit = tasks[taskIndex]
                var originalIndex = originalTasks.findIndex(task => task.taskName === taskToEdit.taskName && task.startDate === taskToEdit.startDate);
                if (originalIndex !== -1) {
                    originalTasks[originalIndex] = { ...tasks[taskIndex] };
                }

                // Save the updated task list back to localStorage
                localStorage.setItem('originalTasks', JSON.stringify(originalTasks));

                // Re-render both views
                renderListView();
                renderCardView();

                // Close the modal
                modal.style.display = 'none';
            };
        });
    }

    var rows = table.querySelectorAll('tr');
    rows.forEach(function(row) {
        attachRowEventListeners(row);
    });

    // Toggle between list and card view
    toggleViewButton.onclick = function() {
        var tableView = document.getElementById('productBacklogTable');

        if (isListView) {
            // Switch to card view
            tableView.style.display = 'none';
            cardViewContainer.style.display = 'flex';
            renderCardView();
            toggleViewButton.innerText = 'Switch to List View';
        } else {
            // Switch to list view
            tableView.style.display = 'table';
            cardViewContainer.style.display = 'none';
            renderListView();
            toggleViewButton.innerText = 'Switch to Card View';
        }

        isListView = !isListView;
    };


// Filtering tasks by selected tag
document.getElementById('tagFilter').addEventListener('change', function() {
    var selectedTag = this.value.toLowerCase();
    
    if (selectedTag === '') {
        // If 'All' is selected, restore the full task list
        tasks = [...originalTasks];
    } else {
        // Otherwise, filter based on the selected tag
        tasks = originalTasks.filter(task => {
            var taskTags = task.tags.toLowerCase().split(', ');
            return taskTags.includes(selectedTag);
        });
    }

    renderListView();
    renderCardView();
});


    // Sorting tasks by priority
    document.getElementById('prioritySort').addEventListener('change', function() {
        var sortDirection = this.value;
        tasks.sort(function(a, b) {
            var priorities = ['low', 'medium', 'important', 'urgent'];
            return sortDirection === 'asc'
                ? priorities.indexOf(a.priority.toLowerCase()) - priorities.indexOf(b.priority.toLowerCase())
                : priorities.indexOf(b.priority.toLowerCase()) - priorities.indexOf(a.priority.toLowerCase());
        });
        renderListView();
        renderCardView();
    });

    // Sorting tasks by date
    document.getElementById('dateSort').addEventListener('change', function() {
        var sortDirection = this.value;
        tasks.sort(function(a, b) {
            var dateA = new Date(a.startDate);
            var dateB = new Date(b.startDate);
            return sortDirection === 'recent' ? dateB - dateA : dateA - dateB;
        });
        renderListView();
        renderCardView();
    });

    // store tasks list in local storage to be used in sprint backlog 
    localStorage.setItem('tasks', JSON.stringify(tasks))

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
});
