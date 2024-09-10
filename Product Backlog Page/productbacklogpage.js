document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('taskModal');
    var addRowButton = document.getElementById('addRowButton');
    var closeButton = document.querySelector('.close');
    var taskForm = document.getElementById('taskForm');
    var table = document.getElementById('productBacklogTable').getElementsByTagName('tbody')[0];
    var toggleViewButton = document.getElementById('toggleViewButton');
    var isListView = true;

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

    // Handle form submission (Add new task)
    taskForm.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        var taskName = document.getElementById('taskName').value;
        var taskType = document.getElementById('taskType').value;
        var priority = document.getElementById('priority').value;
        var tags = Array.from(document.getElementById('tags').selectedOptions).map(option => option.value).join(', ');
        var sprint = document.getElementById('sprint').value;
        var startDate = document.getElementById('startDate').value;
        var status = document.getElementById('status').value;
        var storyPoints = document.getElementById('storyPoints').value;
        var weightage = document.getElementById('weightage').value;
        var taskMember = document.getElementById('taskMember').value;

        // Create a new row in the table
        var newRow = table.insertRow();
        newRow.insertCell(0).innerText = taskName;
        newRow.insertCell(1).innerText = taskType;
        newRow.insertCell(2).innerText = priority;
        newRow.insertCell(3).innerText = tags;
        newRow.insertCell(4).innerText = sprint;
        newRow.insertCell(5).innerText = startDate;
        newRow.insertCell(6).innerText = status;
        newRow.insertCell(7).innerText = storyPoints;
        newRow.insertCell(8).innerText = weightage;
        newRow.insertCell(9).innerText = taskMember;

        var actionsCell = newRow.insertCell(10);
        actionsCell.innerHTML = "<button class='editButton'>Edit</button> <button class='deleteButton'>Delete</button>";

        attachRowEventListeners(newRow);

        // Reset the form
        taskForm.reset();

        // Close the modal
        modal.style.display = 'none';
    };

    // Attach event listeners to new rows
    function attachRowEventListeners(row) {
        var editButton = row.querySelector('.editButton');
        var deleteButton = row.querySelector('.deleteButton');

        deleteButton.addEventListener('click', function() {
            row.remove();
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
    var cardViewContainer = document.createElement('div');
    cardViewContainer.classList.add('card-view');
    document.body.appendChild(cardViewContainer);

    toggleViewButton.onclick = function() {
        var tableView = document.getElementById('productBacklogTable');

        if (isListView) {
            // Switch to card view
            tableView.style.display = 'none';
            cardViewContainer.style.display = 'flex';
            cardViewContainer.innerHTML = ''; // Clear existing cards

            var rows = document.querySelectorAll('#productBacklogTable tbody tr');
            rows.forEach(row => {
                var taskName = row.cells[0].innerText;
                var priority = row.cells[2].innerText;
                var tags = row.cells[3].innerText;
                var storyPoints = row.cells[7].innerText;

                var card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${taskName}</h3>
                    <p><strong>Priority:</strong> ${priority}</p>
                    <p><strong>Tags:</strong> ${tags}</p>
                    <p><strong>Story Points:</strong> ${storyPoints}</p>
                `;
                cardViewContainer.appendChild(card);
            });

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
        var selectedTag = this.value;
        var rows = document.querySelectorAll('#productBacklogTable tbody tr');
        
        rows.forEach(row => {
            var tagsCell = row.cells[3].innerText;
            var taskTags = tagsCell.split(', ');
            
            if (selectedTag === '' || taskTags.includes(selectedTag)) {
                row.style.display = ''; // Show the row if it matches the selected tag or if no tag is selected
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
