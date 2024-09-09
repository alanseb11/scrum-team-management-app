document.addEventListener('DOMContentLoaded', function() {
    // initialising variables
    var modal = document.getElementById('taskModal');
    var addRowButton = document.getElementById('addRowButton');
    var closeButton = document.querySelector('.modal .close');
    var taskForm = document.getElementById('taskForm');
    var table = document.getElementById('productBacklogTable').getElementsByTagName('tbody')[0];

    // Show the modal
    addRowButton.onclick = function() {
        modal.style.display = 'block';
    }

    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Handle form submission
    taskForm.onsubmit = function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form values
        var userStory = document.getElementById('userStory').value;
        var priority = document.getElementById('priority').value;
        var sprint = document.getElementById('sprint').value;
        var startDate = document.getElementById('startDate').value;
        var status = document.getElementById('status').value;
        var taskType = document.getElementById('taskType').value;
        var technicalTask = document.getElementById('technicalTask').value;
        var taskMember = document.getElementById('taskMember').value;

        // Create a new row
        var newRow = table.insertRow();
        newRow.insertCell(0).innerText = userStory;
        newRow.insertCell(1).innerText = priority;
        newRow.insertCell(2).innerText = sprint;
        newRow.insertCell(3).innerText = startDate;
        newRow.insertCell(4).innerText = status;
        newRow.insertCell(5).innerText = taskType;
        newRow.insertCell(6).innerText = technicalTask;
        newRow.insertCell(7).innerText = taskMember;

        // Actions cell with Edit and Delete buttons
        var actionsCell = newRow.insertCell(8);
        var actionsCell2 = newRow.insertCell(9);
        actionsCell.innerHTML = "<button class='editButton'>Edit</button> <button class='deleteButton'>Delete</button>";
        
        // Attach event listeners for new row buttons
        attachRowEventListeners(newRow);

        // Close the modal
        modal.style.display = 'none';

        // Reset the form
        taskForm.reset();
    }

    function attachRowEventListeners(row) {
        var editButton = row.querySelector('.editButton');
        var deleteButton = row.querySelector('.deleteButton');

        // Handle delete button click
        deleteButton.addEventListener('click', function() {
            row.remove();
        });

        // Handle edit button click
        editButton.addEventListener('click', function() {
            var cells = row.querySelectorAll('td');
            if (editButton.innerText === 'Edit') {
                // Enter edit mode
                cells[0].innerHTML = `<input type='text' value='${cells[0].innerText}'>`;
                cells[1].innerHTML = `<select><option value='low' ${cells[1].innerText === 'Low' ? 'selected' : ''}>Low</option><option value='medium' ${cells[1].innerText === 'Medium' ? 'selected' : ''}>Medium</option><option value='high' ${cells[1].innerText === 'High' ? 'selected' : ''}>High</option></select>`;
                cells[2].innerHTML = `<input type='text' value='${cells[2].innerText}'>`;
                cells[3].innerHTML = `<input type='date' value='${cells[3].innerText}'>`;
                cells[4].innerHTML = `<select><option value='in-progress' ${cells[4].innerText === 'In Progress' ? 'selected' : ''}>In Progress</option><option value='Not Started' ${cells[4].innerText === 'Not Started' ? 'selected' : ''}>Not Started</option><option value='Completed' ${cells[4].innerText === 'Completed' ? 'selected' : ''}>Completed</option></select>`;
                cells[5].innerHTML = `<select><option value='Bug' ${cells[5].innerText === 'Bug' ? 'selected' : ''}>Bug</option><option value='Story' ${cells[5].innerText === 'Story' ? 'selected' : ''}>Story</option></select>`;
                cells[6].innerHTML = `<input type='text' value='${cells[5].innerText}'>`;
                cells[7].innerHTML = `<input type='text' value='${cells[6].innerText}'>`;
                editButton.innerText = 'Save';
            } else {
                // Save changes
                cells[0].innerText = cells[0].querySelector('input').value;
                cells[1].innerText = cells[1].querySelector('select').value;
                cells[2].innerText = cells[2].querySelector('input').value;
                cells[3].innerText = cells[3].querySelector('input').value;
                cells[4].innerText = cells[4].querySelector('select').value;
                cells[5].innerText = cells[5].querySelector('input').value;
                cells[6].innerText = cells[5].querySelector('input').value;
                cells[7].innerText = cells[6].querySelector('input').value;
                editButton.innerText = 'Edit';
            }
        });
    }
});
