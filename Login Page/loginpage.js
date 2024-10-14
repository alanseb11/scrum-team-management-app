document.addEventListener('DOMContentLoaded', function () {
    // Function to handle login and prevent form submission if fields are empty
    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value.trim();

        if (username && password) {
            // Retrieve stored users from localStorage
            let users = JSON.parse(localStorage.getItem('teamMembers')) || [];

            // Check if the credentials match the admin credentials
            if (username === 'admin' && password === 'admin12345') {
                // Redirect to the admin menu if the credentials match
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = "../Admin Page/adminmenu.html";
            } else {
                // Check if the credentials match any registered user
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    // Redirect to the homepage if credentials match a registered user
                    localStorage.setItem('isUserLoggedIn', 'true');
                    localStorage.setItem('loggedInUsername', username);
                    window.location.href = "../Sprint Backlog Page/sprintbacklog.html";
                } else {
                    // Show an alert if the credentials are invalid
                    alert("Invalid username or password. Please try again.");
                }
            }
        } else {
            alert("Please enter both username and password."); // Alert if fields are empty
        }
    }

    // Add event listener to login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Register a new user
    signUpForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('fName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Generate a username from the full name (removes spaces and makes lowercase)
        const username = fullName.replace(/\s+/g, '').toLowerCase();

        // Store the new user in localStorage
        let users = JSON.parse(localStorage.getItem('teamMembers')) || [];

        // Check if the username is already taken
        const userExists = users.some(u => u.username === username);
        if (userExists) {
            alert('Username already taken. Please use a different name.');
            return;
        }

        users.push({ name: fullName, email, username, password });
        localStorage.setItem('teamMembers', JSON.stringify(users));

        // Redirect to the sign-in page
        alert('Registration successful. You can now sign in.');
        signUpForm.style.display = 'none';
        signInForm.style.display = 'block';
    });
});
