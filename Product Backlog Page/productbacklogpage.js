document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('taskModal');
    var addRowButton = document.getElementById('addRowButton');
    var closeButton = document.querySelector('.close');
    var taskForm = document.getElementById('taskForm');
    var table = document.getElementById('productBacklogTable').getElementsByTagName('tbody')[0];
    var toggleViewButton = document.getElementById('toggleViewButton');
    var isListView = true;
    var tasks = [
        {
            taskName: 'Example Task 1',
            taskType: 'Story',
            priority: 'Medium',
            tags: 'Frontend, API',
            sprint: 'Sprint 1',
            startDate: '2024-09-10',
            status: 'In Progress',
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
            status: 'Not Started',
            storyPoints: '8',
            taskMember: 'Amar'
        }
    ];
    var cardViewContainer = document.createElement('div');
    cardViewContainer.classList.add('card-view');
    cardViewContainer.style.display = 'none'; // Start with card view hidden
    document.body.appendChild(cardViewContainer);

    // Custom multiselect logic
    var selectedItems = document.getElementById('selectedItems');
    var optionsContainer = document.getElementById('optionsContainer');
    var tagsInput = document.getElementById('tags');

    // Toggle options visibility
    selectedItems.addEventListener('click', function() {
        optionsContainer.style.display = optionsContainer.style.display === 'none' || optionsContainer.style.display === '' ? 'block' : 'none';
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
        taskForm.onsubmit = addTask;
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
        var status = document.getElementById('status').value;
        var storyPoints = document.getElementById('storyPoints').value;
        var taskMember = document.getElementById('taskMember').value;

        // Store task in the centralized array
        tasks.push({
            taskName,
            taskType,
            priority,
            tags,
            sprint,
            startDate,
            status,
            storyPoints,
            taskMember
        });

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
            tasks.splice(taskIndex, 1); 
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
            document.getElementById('status').value = tasks[taskIndex].status;
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
                    status: document.getElementById('status').value,
                    storyPoints: document.getElementById('storyPoints').value,
                    taskMember: document.getElementById('taskMember').value
                };

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
            toggleViewButton.innerText = 'Switch to Card View';
        }

        isListView = !isListView;
    };

    // Filtering tasks by selected tag
    document.getElementById('tagFilter').addEventListener('change', function() {
        var selectedTag = this.value.toLowerCase();
        var rows = document.querySelectorAll('#productBacklogTable tbody tr');
        
        rows.forEach(row => {
            var tagsCell = row.cells[3].innerText.toLowerCase();
            var taskTags = tagsCell.split(', ').map(tag => tag.trim());
            
            if (selectedTag === '' || taskTags.includes(selectedTag)) {
                row.style.display = ''; // Show the row if it matches the selected tag or no tag is selected
            } else {
                row.style.display = 'none'; // Hide the row if it doesn't match
            }
        });
    });

    // Sorting tasks by priority
    document.getElementById('prioritySort').addEventListener('change', function() {
        var sortDirection = this.value;
        var rows = Array.from(document.querySelectorAll('#productBacklogTable tbody tr'));
    
        rows.sort(function(rowA, rowB) {
            var priorityA = rowA.cells[2].innerText.toLowerCase();
            var priorityB = rowB.cells[2].innerText.toLowerCase();
            var priorities = ['low', 'medium', 'important', 'urgent'];

            if (sortDirection === 'asc') {
                return priorities.indexOf(priorityA) - priorities.indexOf(priorityB);
            } else {
                return priorities.indexOf(priorityB) - priorities.indexOf(priorityA);
            }
        });

        rows.forEach(row => row.parentNode.appendChild(row)); // Reorder rows in the table
    });

    // Sorting tasks by date
    document.getElementById('dateSort').addEventListener('change', function() {
        var sortDirection = this.value;
        var rows = Array.from(document.querySelectorAll('#productBacklogTable tbody tr'));
    
        rows.sort(function(rowA, rowB) {
            var dateA = new Date(rowA.cells[5].innerText);
            var dateB = new Date(rowB.cells[5].innerText);
    
            return sortDirection === 'recent' ? dateB - dateA : dateA - dateB;
        });

        rows.forEach(row => row.parentNode.appendChild(row)); // Reorder rows in the table
    });
});
