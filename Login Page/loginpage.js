// Function to handle login and prevent form submission if fields are empty
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        window.location.href = "../Home Page/homepage.html"; 
    } else {
        alert("Please enter both username and password."); 
    }
}
document.getElementById('loginForm')
    .addEventListener('submit', (event) => {
        handleLogin(event);
    });
// Existing functionality to toggle between "Sign In" and "Register" forms
const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");
signUpButton.addEventListener('click', function(){
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});
signInButton.addEventListener('click', function(){
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});
