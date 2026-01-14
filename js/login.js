// Load remembered email on page load
function loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
}

// Login form submission
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;

        // Basic validation
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill in all fields.'
            });
            return;
        }

        // Handle remember me functionality
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        // Simulate login by storing user data in localStorage
        const userData = {
            email: email,
            isLoggedIn: true,
            rememberMe: rememberMe
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        // Show success feedback
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back! Redirecting to home...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Redirect to home page
            window.location.href = '../index.html';
        });
    });
}

// Load remembered email when page loads
window.addEventListener('DOMContentLoaded', loadRememberedEmail);

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');

    const navAuthLinks = document.getElementById('navAuthLinks');
    const navUserProfile = document.getElementById('navUserProfile');
    const userGreeting = document.getElementById('userGreeting');

    if (isLoggedIn === 'true' && currentUser) {
        const user = JSON.parse(currentUser);
        const displayName = user.firstname || user.email.split('@')[0];

        navAuthLinks.style.display = 'none';
        navUserProfile.style.display = 'block';
        userGreeting.textContent = `Welcome, ${displayName}!`;

        document.getElementById('logoutBtn').addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    } else {
        navAuthLinks.style.display = 'block';
        navUserProfile.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out.',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.reload();
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});
