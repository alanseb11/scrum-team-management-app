// script.js

document.addEventListener('DOMContentLoaded', function() {
    var addSprintButton = document.getElementById('addSprintButton');
    var modal = document.getElementById('sprintModal');
    var sprints = [];
    var closeButton = document.querySelector('.close');
    var sprintForm = document.getElementById('sprintForm');

    // getting sprint columns
    var notStartedList = document.getElementById('list1');
    var activeList = document.getElementById('list2');
    var completedList = document.getElementById('list3');

    const lists = document.querySelectorAll('.draggable-list');
    let draggedItem = null;

    // list of tasks
    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    console.log(tasks)

    const mainContainer = document.querySelector('.main-container');

    lists.forEach(list => {
        list.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'LI') {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        list.addEventListener('dragend', function (e) {
            if (e.target.tagName === 'LI') {
                setTimeout(() => {
                    e.target.classList.remove('dragging');
                    draggedItem = null;
                }, 0);
            }
        });

        list.addEventListener('dragover', function (e) {
            e.preventDefault(); // Prevent default to allow drop
            if (e.target.tagName === 'LI') {
                e.target.classList.add('over');
            }
        });

        list.addEventListener('dragleave', function (e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }
        });

        list.addEventListener('drop', function (e) {
            e.preventDefault(); // Prevent default action (open as link for some elements)

            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');

                // Move dragged item to the dropped position
                if (draggedItem !== this) {
                    let draggedIndex = [...this.parentNode.children].indexOf(draggedItem);
                    let targetIndex = [...this.parentNode.children].indexOf(e.target);

                    if (targetIndex > draggedIndex) {
                        this.insertBefore(draggedItem, e.target.nextSibling);
                    } else {
                        this.insertBefore(draggedItem, e.target);
                    }
                }
            }

            // If the drop happens on the list (not on an item), append the item at the end
            if (e.target === this && draggedItem !== null) {
                this.appendChild(draggedItem);
            }
        });
    });


    // Show the sprint modal
    addSprintButton.onclick = function() {
        modal.style.display = 'block';
        sprintForm.onsubmit = addSprint;
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


    // make each item created draggable e.g. when adding a new sprint
    function itemDraggable(item) {
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'LI') {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        item.addEventListener('dragend', function (e) {
            if (e.target.tagName === 'LI') {
                setTimeout(() => {
                    e.target.classList.remove('dragging');
                    draggedItem = null;
                }, 0);
            }
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault(); // Prevent default to allow drop
            if (e.target.tagName === 'LI') {
                e.target.classList.add('over');
            }
        });

        item.addEventListener('dragleave', function (e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }
        });

        item.addEventListener('drop', function (e) {
            e.preventDefault(); // Prevent default action (open as link for some elements)

            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');

                // Move dragged item to the dropped position
                if (draggedItem !== this) {
                    let draggedIndex = [...this.parentNode.children].indexOf(draggedItem);
                    let targetIndex = [...this.parentNode.children].indexOf(e.target);

                    if (targetIndex > draggedIndex) {
                        this.insertBefore(draggedItem, e.target.nextSibling);
                    } else {
                        this.insertBefore(draggedItem, e.target);
                    }
                }
            }

            // If the drop happens on the list (not on an item), append the item at the end
            if (e.target === this && draggedItem !== null) {
                this.appendChild(draggedItem);
            }
        });
    }

    // Handle form submission (Add new sprint)
    function addSprint(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        var sprintName = document.getElementById('sprintName').value;
        var startDate = document.getElementById('startDate').value;
        var endDate = document.getElementById('endDate').value;
        var status = document.getElementById('status').value;
        var selectedPBIS = document.getElementById('customMultiselect').value; 
        
        // date validation
        var startDateError = document.getElementById('startDateError');
        var endDateError = document.getElementById('endDateError');
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


        // Store sprint in the centralized array
        var newSprintData = {
            sprintName: sprintName, 
            startDate: startDate,
            endDate: endDate,
            status: status,
            selectedPBIS: selectedPBIS
        }
        var newSprintDraggable = document.createElement('li')
        newSprintDraggable.innerHTML = `<button class="editSprintButton">${sprintName}</button></td>`;

        newSprintDraggable.setAttribute('name', sprintName);
        newSprintDraggable.setAttribute('start-date', startDate);
        newSprintDraggable.setAttribute('end-date', endDate);
        newSprintDraggable.setAttribute('status', status);

        sprints.push(newSprintData);
        originalSprints.push(newSprintData); // Update the original sprint list

        itemDraggable(newSprintDraggable);

        // adding new sprint to column 
        if (status == 'not-started') { 
            // append sprint to column
            notStartedList.append(newSprintDraggable)

        } else if (status == 'in-progress') {
            activeList.append(newSprintDraggable)

        } else {
            completedList.append(newSprintDraggable)
            
        }

        // attach event listener to new sprint
        attachSprintEventListeners(newSprintDraggable,sprints.length-1);

        // // Re-render both views after adding the sprint
        // renderListView();
        // renderCardView();

        // Reset the form
        sprintForm.reset();

        // Close the modal
        modal.style.display = 'none';
    };

    // edit sprint functionality 
    // Attach event listeners to new sprints
    function attachSprintEventListeners(sprint, sprintIndex) {
        var editSprintButton = sprint.querySelector('.editSprintButton');
    
        editSprintButton.addEventListener('click', function() {
            // Open the modal and populate the form with the task details
            modal.style.display = 'block';
            console.log(sprints)
            console.log(sprintIndex)
            document.getElementById('sprintName').value = sprints[sprintIndex].sprintName;
            document.getElementById('startDate').value = sprints[sprintIndex].startDate;
            document.getElementById('endDate').value = sprints[sprintIndex].endDate;
            document.getElementById('status').value = sprints[sprintIndex].status;
            document.getElementById('customMultiselect').value = sprints[sprintIndex].selectedPBIS;

            // Update form submission to save changes
            sprintForm.onsubmit = function(event) {
                event.preventDefault(); // Prevent default form submission

                // Update sprint details in the sprint array
                sprints[sprintIndex] = {
                    sprintName: document.getElementById('sprintName').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                    status: document.getElementById('status').value,
                    selectedPBIS: document.getElementById('customMultiselect').value    
                };

                // updates sprint name if modified 
                sprint.querySelector('.editSprintButton').innerText = sprints[sprintIndex].sprintName; 

                var sprintToEdit = sprints[sprintIndex]
                var originalIndex = originalSprints.findIndex(sprint => sprint.sprintName === sprintToEdit.sprintName && sprint.startDate === sprintToEdit.sprintDate);
                if (originalIndex !== -1) {
                    originalSprints[originalIndex] = { ...sprints[sprintIndex] };
                }

                // // Re-render both views
                // renderListView();
                // renderCardView();
                sprintForm.reset();

                // Close the modal
                modal.style.display = 'none';
            };
        });
    }

    var originalSprints = [...sprints]; // Keep a copy of the original task list


    // Custom multiselect logic
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

    // Add Logout Functionality
    document.addEventListener('DOMContentLoaded', function () {
        // Check if the user is logged in as admin or a regular user
        if (localStorage.getItem('isAdminLoggedIn') !== 'true' && localStorage.getItem('isUserLoggedIn') !== 'true') {
            // If not logged in, redirect to the login page
            window.location.href = "../Login Page/loginpage.html";
        }

        // Logout functionality
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                // Clear login status from localStorage
                localStorage.removeItem('isAdminLoggedIn');
                localStorage.removeItem('isUserLoggedIn');
                // Redirect to login page
                window.location.href = "../Login Page/loginpage.html";
            });
        }
    });
})