document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in as admin
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        // If not logged in as admin, redirect to the login page
        window.location.href = "../Login Page/loginpage.html";
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Clear login status from localStorage
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isUserLoggedIn');
        // Redirect to login page
        window.location.href = "../Login Page/loginpage.html";
    });

    // Load team members if any are stored
    loadTeamMembers();

    // Modal setup for editing members
    const editMemberModal = document.getElementById('editMemberModal');
    const closeModalButton = document.querySelector('.close');

    closeModalButton.onclick = function () {
        editMemberModal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == editMemberModal) {
            editMemberModal.style.display = 'none';
        }
    };
});

// Function to create a team member
function createTeamMember() {
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const defaultPassword = 'password12345';

    // Create a default username by removing spaces and making it lowercase
    const username = name.replace(/\s+/g, '').toLowerCase();

    // Store the new team member in localStorage
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.push({ name, email, username, password: defaultPassword });
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

    // Update the team members list
    loadTeamMembers();

    // Reset the form fields
    document.getElementById('createTeamMemberForm').reset();
}

// Function to load team members
function loadTeamMembers() {
    const teamMembersList = document.getElementById('teamMembersList');
    teamMembersList.innerHTML = ''; // Clear the list first

    // Initialize with default team members if none exist
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    if (teamMembers.length === 0 && !localStorage.getItem('defaultMembersInitialized')) {
        teamMembers = [
            { name: 'Alan Sebastian', email: 'alan.sebastian@debugdivas.com', username: 'alansebastian', password: 'password12345' },
            { name: 'Amarprit Singh', email: 'amarprit.singh@debugdivas.com', username: 'amarpritsingh', password: 'password12345' }
        ];
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
        localStorage.setItem('defaultMembersInitialized', 'true');
    }
    teamMembers.forEach((member, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.username}</td>
            <td>${member.password}</td>
            <td>
                <div class="actions-container">
                    <button class="edit-button" onclick="openEditModal(${index})">Edit</button>
                    <button class="delete-button" onclick="deleteTeamMember(${index})">Delete</button>
                </div>
            </td>
        `;

        teamMembersList.appendChild(row);
    });
}

// Function to open the edit modal with pre-filled values
function openEditModal(index) {
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const member = teamMembers[index];

    // Fill in the current member details in the form
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberEmail').value = member.email;
    document.getElementById('editMemberUsername').value = member.username;
    document.getElementById('editMemberPassword').value = member.password;

    // Show the modal
    const editMemberModal = document.getElementById('editMemberModal');
    editMemberModal.style.display = 'block';

    // Update the form submission handler to save changes
    const editForm = document.getElementById('editTeamMemberForm');
    editForm.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission

        // Update the team member with new values
        teamMembers[index] = {
            name: document.getElementById('editMemberName').value,
            email: document.getElementById('editMemberEmail').value,
            username: document.getElementById('editMemberUsername').value,
            password: document.getElementById('editMemberPassword').value
        };

        // Save updated members list to localStorage
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

        // Reload the team members list and close the modal
        loadTeamMembers();
        editMemberModal.style.display = 'none';
    };
}

// Function to delete a team member
function deleteTeamMember(index) {
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.splice(index, 1); // Remove the member at the given index
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

    // Update the team members list
    loadTeamMembers();
}
