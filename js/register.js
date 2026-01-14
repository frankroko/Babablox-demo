// Register form submission
const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');

if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Validate that passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match. Please try again.'
            });
            return;
        }

        // Validate that terms are accepted
        if (!termsAccepted) {
            alert('Please accept the Terms and Conditions.');
            return;
        }

        // Show success message
        successMessage.classList.add('show');
        registerForm.style.display = 'none';
        document.querySelector('.register-header').style.display = 'none';
        document.querySelector('.login-link').style.display = 'none';

        // Store user data in localStorage (simulating login)
        const userData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            isLoggedIn: true
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        // Redirect to home page after 2.5 seconds
        setTimeout(function() {
            window.location.href = '../index.html';
        }, 2500);
    });
}
