document.addEventListener('DOMContentLoaded', function() {
    const taskTableBody = document.getElementById('tableBody');
    const addNewTaskButton = document.getElementById('addNewTask');
    const modal = document.getElementById('taskModal');
    const closeButton = document.querySelector('.close');
    const taskForm = document.getElementById('taskForm');
    const toggleViewButton = document.getElementById('toggleViewButton');
    let isListView = true;

    // Load tasks from local storage or initialize with predefined tasks
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [
        {
            taskName: 'Example Task 1',
            taskType: 'Story',
            priority: 'Medium',
            taskTags: 'Frontend, API',
            sprint: 'Sprint 1',
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
            taskTags: 'Backend, Database',
            sprint: 'Sprint 2',
            taskDescription: 'This is another example task',
            status: 'Not Started',
            stage: 'Integration',
            storyPoints: '8',
            taskMember: 'Amar'
        }
    ];


    // Open the modal to add a new task
    addNewTaskButton.addEventListener('click', () => {
        modal.style.display = 'block';
        taskForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Task';
        taskForm.onsubmit = handleAddTask;
    });

    // Close the modal
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });


    // Rendering functions implemented with tag filtering and priority sorting
    function renderListView(filterTag = '', sortDirection = 'none') {
        taskTableBody.innerHTML = ''; // Clear the table first

        // Filter tasks by tag
        let filteredTasks = tasks.filter(task => filterTag === '' || task.taskTags.includes(filterTag));
        
        // Apply priority sorting if selected
        if (sortDirection !== 'none') {
            const priorities = ['low', 'medium', 'important', 'urgent'];
            filteredTasks.sort(function(a, b) {
                return sortDirection === 'asc'
                    ? priorities.indexOf(a.priority.toLowerCase()) - priorities.indexOf(b.priority.toLowerCase())
                    : priorities.indexOf(b.priority.toLowerCase()) - priorities.indexOf(a.priority.toLowerCase());
            });
        }

        // Render filtered and sorted tasks in the list view
        filteredTasks.forEach(task => addTaskToTable(task));
    }

    function renderCardView(filterTag = '', sortDirection = 'none') {
        cardViewContainer.innerHTML = ''; // Clear existing cards

        // Filter tasks by tag
        let filteredTasks = tasks.filter(task => filterTag === '' || task.taskTags.includes(filterTag));

        // Apply priority sorting if selected
        if (sortDirection !== 'none') {
            const priorities = ['low', 'medium', 'important', 'urgent'];
            filteredTasks.sort(function(a, b) {
                return sortDirection === 'asc'
                    ? priorities.indexOf(a.priority.toLowerCase()) - priorities.indexOf(b.priority.toLowerCase())
                    : priorities.indexOf(b.priority.toLowerCase()) - priorities.indexOf(a.priority.toLowerCase());
            });
        }

        // Render filtered and sorted tasks in the card view
        filteredTasks.forEach(function(task) {
            var card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${task.taskName}</h3>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Tags:</strong> ${task.taskTags}</p>
                <p><strong>Story Points:</strong> ${task.storyPoints}</p>
            `;
            cardViewContainer.appendChild(card);
        });
    }

    // Event listener for tag filtering and priority sorting
    const tagFilter = document.getElementById('tagFilter');
    const prioritySort = document.getElementById('prioritySort');

    tagFilter.addEventListener('change', function() {
        const selectedTag = tagFilter.value;
        const sortDirection = prioritySort.value;

        if (isListView) {
            renderListView(selectedTag, sortDirection); // Rerender the list view with the selected tag and priority sorting
        } else {
            renderCardView(selectedTag, sortDirection); // Rerender the card view with the selected tag and priority sorting
        }
    });

    prioritySort.addEventListener('change', function() {
        const selectedTag = tagFilter.value;
        const sortDirection = prioritySort.value;

        if (isListView) {
            renderListView(selectedTag, sortDirection); // Rerender the list view with the selected tag and priority sorting
        } else {
            renderCardView(selectedTag, sortDirection); // Rerender the card view with the selected tag and priority sorting
        }
    });


    function addTaskToTable(task) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.taskName}</td>
            <td>${task.priority}</td>
            <td>${task.taskTags}</td>
            <td>${task.storyPoints}</td>
            <td>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);


        // Attach edit and delete functionality
        row.querySelector('.editButton').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditTaskModal(task, row);
        });
        row.querySelector('.deleteButton').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(row, task);
        });
    }


    function handleAddTask(event) {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskType = document.getElementById('taskType').value;
        const priority = document.getElementById('priority').value;
        const taskTags = document.getElementById('tags').value;
        const storyPoints = document.getElementById('storyPoints').value;
        const sprint = document.getElementById('sprint').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const status = document.getElementById('status').value;
        const stage = document.getElementById('stage').value;
        const taskMember = document.getElementById('taskMember').value;

        const newTask = { taskName, taskType, priority, taskTags, storyPoints, sprint, taskDescription, status, stage, taskMember };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        addTaskToTable(newTask);
        modal.style.display = 'none';
    }

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
        document.getElementById('status').value = task.status;
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
            task.status = document.getElementById('status').value;
            task.stage = document.getElementById('stage').value;
            task.taskMember = document.getElementById('taskMember').value;
    
            // Save updated task data to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
    
            // Update the task row in the table with new data
            row.cells[0].textContent = task.taskName;
            row.cells[1].textContent = task.priority;
            row.cells[2].textContent = task.taskTags;
            row.cells[3].textContent = task.storyPoints;
    
            // Hide the modal after saving the changes
            modal.style.display = 'none';
        };
    }
    

    function deleteTask(row, task) {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        row.remove();
    }


    // Logic below is for selecting tags
    const selectedItems = document.getElementById('selectedItems');
    const optionsContainer = document.getElementById('optionsContainer');
    const tagsInput = document.getElementById('tags');

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


    // Variables and logic to add card view HTML
    const mainContainer = document.querySelector('.main-container');
    const cardViewContainer = document.createElement('div');
    cardViewContainer.classList.add('card-view');
    cardViewContainer.style.display = 'none'; // Start with card view hidden
    mainContainer.appendChild(cardViewContainer);

    // Toggle between list and card view
    toggleViewButton.onclick = function() {
        const tableView = document.getElementById('productBacklogTable');

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

    renderListView();
});