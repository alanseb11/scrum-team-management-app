document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in as admin
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        // If not logged in as admin, redirect to the login page
        window.location.href = "../Login Page/loginpage.html";
    }

    // Show the admin link if logged in as admin
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        document.getElementById('adminLink').style.display = 'inline-block';
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
});

// Function to create a team member
function createTeamMember() {
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const defaultPassword = 'password12345';

    // Store the new team member in localStorage
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const username = name.replace(/\s+/g, '').toLowerCase(); // Removes spaces and makes the username lowercase
    teamMembers.push({ name, email, username, password: defaultPassword });
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

    // Update the team members list
    loadTeamMembers();
}

// Function to load team members
function loadTeamMembers() {
    const teamMembersList = document.getElementById('teamMembersList');
    teamMembersList.innerHTML = ''; // Clear the list first

    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.forEach((member, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `Name: ${member.name}, Email: ${member.email}, Username: ${member.username}, Password: ${member.password} 
        <button class="delete-button" onclick="deleteTeamMember(${index})">Delete</button>`;
        teamMembersList.appendChild(listItem);
    });
}

// Function to delete a team member
function deleteTeamMember(index) {
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.splice(index, 1); // Remove the member at the given index
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

    // Update the team members list
    loadTeamMembers();
}
