document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in as admin or a regular user
    if (localStorage.getItem('isAdminLoggedIn') !== 'true' && localStorage.getItem('isUserLoggedIn') !== 'true') {
        // If not logged in, redirect to the login page
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
});
