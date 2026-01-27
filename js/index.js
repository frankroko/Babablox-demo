// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');

    const navAuthLinks = document.getElementById('navAuthLinks');
    const navUserProfile = document.getElementById('navUserProfile');
    const userGreeting = document.getElementById('userGreeting');

    if (isLoggedIn === 'true' && currentUser) {
        const user = JSON.parse(currentUser);
        const displayName = user.firstname || user.email.split('@')[0];

        // Show user profile section and hide login links
        navAuthLinks.style.display = 'none';
        navUserProfile.style.display = 'block';
        userGreeting.textContent = `Welcome, ${displayName}!`;

        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    } else {
        // Show login links and hide user profile
        navAuthLinks.style.display = 'block';
        navUserProfile.style.display = 'none';
    }
}

function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');

    // Redirect to home page
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

// Add to Cart functionality
function addToCart(productName, productPrice) {
    if (!productName || productPrice === null || isNaN(productPrice) || productPrice === 0) {
        console.error('Invalid product data:', productName, productPrice);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to add product to cart'
        });
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    // Show SweetAlert2 and don't redirect
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: productName + ' added to cart!',
        timer: 2000,
        showConfirmButton: false
    });
}

// Buy Now functionality
function buyNow(productName, productPrice) {
    if (!productName || productPrice === null || isNaN(productPrice) || productPrice === 0) {
        console.error('Invalid product data:', productName, productPrice);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to process order'
        });
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
        name: productName,
        price: productPrice,
        quantity: 1
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Determine the correct path to cart.html based on current location
    const currentPath = window.location.pathname;
    const cartPath = currentPath.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
    
    // Instant redirect to cart
    window.location.href = cartPath;
}

// Initialize buttons on page load
function initializeButtons() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const buyNowBtns = document.querySelectorAll('.buy-now-btn');
    
    console.log('Initializing buttons. Found add-to-cart:', addToCartBtns.length, 'buy-now:', buyNowBtns.length);
    
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent.trim();
            const priceText = productCard.querySelector('.product-price').textContent.trim();
            const productPrice = parseInt(priceText.replace('฿', '').trim());
            
            console.log('Add to cart clicked:', { productName, priceText, productPrice });
            addToCart(productName, productPrice);
        });
    });
    
    buyNowBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent.trim();
            const priceText = productCard.querySelector('.product-price').textContent.trim();
            const productPrice = parseInt(priceText.replace('฿', '').trim());
            
            console.log('Buy now clicked:', { productName, priceText, productPrice });
            buyNow(productName, productPrice);
        });
    });
}

// Check login status and initialize buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeButtons();
});

