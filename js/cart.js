// Load cart from localStorage and display items
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty"><p>Your cart is empty. <a href="../index.html">Continue shopping</a></p></div>';
        cartSummary.style.display = 'none';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-price">฿${item.price}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn qty-minus" onclick="updateQuantity(${index}, -1)" title="Decrease quantity">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="qty-btn qty-plus" onclick="updateQuantity(${index}, 1)" title="Increase quantity">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;

    const total = subtotal;

    document.getElementById('subtotal').textContent = '฿' + subtotal.toFixed(2);
    document.getElementById('total').textContent = '฿' + total.toFixed(2);
    cartSummary.style.display = 'block';

    // Add checkout button listener
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal;

        // Save order to order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const newOrder = {
            items: cart,
            subtotal: subtotal,
            total: total,
            date: new Date().toISOString()
        };
        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Order placed successfully! Thank you for your purchase.',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            localStorage.removeItem('cart');
            window.location.href = 'order-history.html';
        });
    });
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function clearCart() {
    Swal.fire({
        title: 'Clear Cart?',
        text: 'Are you sure you want to clear the entire cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#4a0080',
        confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('cart');
            loadCart();
        }
    });
}

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

// Initialize cart on page load
window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadCart();
});

