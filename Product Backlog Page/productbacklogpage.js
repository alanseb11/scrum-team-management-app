document.getElementById('addRowButton').addEventListener('click', function() {
    var table = document.getElementById('productBacklogTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    
    // Insert cells into the new row
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    var cell8 = newRow.insertCell(7);
    var cell9 = newRow.insertCell(8);

    cell1.innerHTML = "<input type='text' placeholder='New User Story'>";
    cell2.innerHTML = "<select><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option></select>";
    cell3.innerHTML = "<input type='text' placeholder='Sprint'>";
    cell4.innerHTML = "<input type='date'>";
    cell5.innerHTML = "<select><option value='in-progress'>In Progress</option><option value='not-started'>Not Started</option><option value='completed'>Completed</option></select>";
    cell6.innerHTML = "<input type='text' placeholder='Technical Task'>";
    cell7.innerHTML = "<input type='text' placeholder='Task Member'>";
    
    // Confirm button
    cell8.innerHTML = "<button class='confirmButton'>Confirm</button>";
    
    // Delete button
    cell9.innerHTML = "<button class='deleteButton'>Delete</button>";
    
    var confirmButton = cell8.querySelector('.confirmButton');
    var deleteButton = cell9.querySelector('.deleteButton');
    
    confirmButton.addEventListener('click', function() {
        alert('Row confirmed!'); // can replace this with more complex logic
    });

    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
});
