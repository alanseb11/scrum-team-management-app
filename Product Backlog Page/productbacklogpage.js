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
            weightage: '7',
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
            weightage: '10',
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
        tasks.forEach(function(task) {
            var newRow = table.insertRow();
            newRow.insertCell(0).innerText = task.taskName;
            newRow.insertCell(1).innerText = task.taskType;
            newRow.insertCell(2).innerText = task.priority;
            newRow.insertCell(3).innerText = task.tags;
            newRow.insertCell(4).innerText = task.sprint;
            newRow.insertCell(5).innerText = task.startDate;
            newRow.insertCell(6).innerText = task.status;
            newRow.insertCell(7).innerText = task.storyPoints;
            newRow.insertCell(8).innerText = task.weightage;
            newRow.insertCell(9).innerText = task.taskMember;
            var actionsCell = newRow.insertCell(10);
            actionsCell.innerHTML = "<button class='editButton'>Edit</button> <button class='deleteButton'>Delete</button>";

            attachRowEventListeners(newRow);
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
        var weightage = document.getElementById('weightage').value;
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
            weightage,
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
            var cells = row.querySelectorAll('td');
            if (editButton.innerText === 'Edit') {
                // Enable editing in the row
                cells[0].innerHTML = `<input type='text' value='${cells[0].innerText}'>`;
                cells[1].innerHTML = `<select><option value='story' ${cells[1].innerText === 'Story' ? 'selected' : ''}>Story</option><option value='bug' ${cells[1].innerText === 'Bug' ? 'selected' : ''}>Bug</option></select>`;
                cells[2].innerHTML = `<select><option value='low' ${cells[2].innerText === 'Low' ? 'selected' : ''}>Low</option><option value='medium' ${cells[2].innerText === 'Medium' ? 'selected' : ''}>Medium</option><option value='important' ${cells[2].innerText === 'Important' ? 'selected' : ''}>Important</option><option value='urgent' ${cells[2].innerText === 'Urgent' ? 'selected' : ''}>Urgent</option></select>`;
                cells[3].innerHTML = `<input type='text' value='${cells[3].innerText}'>`;
                cells[4].innerHTML = `<input type='text' value='${cells[4].innerText}'>`;
                cells[5].innerHTML = `<input type='date' value='${cells[5].innerText}'>`;
                cells[6].innerHTML = `<select>
                                        <option value='not-started' ${cells[6].innerText === 'Not Started' ? 'selected' : ''}>Not Started</option><option value='in-progress' ${cells[6].innerText === 'In Progress' ? 'selected' : ''}>In Progress</option><option value='completed' ${cells[6].innerText === 'Completed' ? 'selected' : ''}>Completed</option></select>`;
                cells[7].innerHTML = `<input type='number' value='${cells[7].innerText}' min='0' max='10'>`; // Story Points as number
                cells[8].innerHTML = `<input type='number' value='${cells[8].innerText}' min='1' max='10'>`; // Weightage as number
                cells[9].innerHTML = `<select>
                                        <option value='Lisa' ${cells[9].innerText === 'Lisa' ? 'selected' : ''}>Lisa</option>
                                        <option value='Amar' ${cells[9].innerText === 'Amar' ? 'selected' : ''}>Amar</option>
                                        <option value='Alan' ${cells[9].innerText === 'Alan' ? 'selected' : ''}>Alan</option>
                                        <option value='Sanjevan' ${cells[9].innerText === 'Sanjevan' ? 'selected' : ''}>Sanjevan</option>
                                        <option value='Han' ${cells[9].innerText === 'Han' ? 'selected' : ''}>Han</option>
                                        <option value='Michael' ${cells[9].innerText === 'Michael' ? 'selected' : ''}>Michael</option>
                                      </select>`;
                editButton.innerText = 'Save';
            } else {
                // Save edited values
                cells[0].innerText = cells[0].querySelector('input').value;
                cells[1].innerText = cells[1].querySelector('select').value;
                cells[2].innerText = cells[2].querySelector('select').value;
                cells[3].innerText = cells[3].querySelector('input').value;
                cells[4].innerText = cells[4].querySelector('input').value;
                cells[5].innerText = cells[5].querySelector('input').value;
                cells[6].innerText = cells[6].querySelector('select').value;
                cells[7].innerText = cells[7].querySelector('input').value; // Save Story Points
                cells[8].innerText = cells[8].querySelector('input').value; // Save Weightage
                cells[9].innerText = cells[9].querySelector('select').value; // Save Assignee
                editButton.innerText = 'Edit';
            }
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
