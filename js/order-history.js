// Load and display order history
function loadOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const ordersContainer = document.getElementById('ordersContainer');

    if (orderHistory.length === 0) {
        ordersContainer.innerHTML = '<div class="order-empty"><p>ยังไม่มีคำสั่งซื้อ <a href="../index.html">เริ่มการช้อปปิ้ง</a></p></div>';
        return;
    }

    let html = '';
    orderHistory.forEach((order, index) => {
        const orderNumber = 'ORD-' + String(1000 + index).padStart(4, '0');
        const orderDate = new Date(order.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let itemsHtml = '';
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHtml += `
                <div class="order-product">
                    <div class="product-info">
                        <h4>${item.name}</h4>
                        <p>จำนวน: ${item.quantity} × ฿${item.price}</p>
                    </div>
                    <div class="product-total">฿${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });

        html += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <div class="order-number">${orderNumber}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="order-status">สำเร็จ</div>
                </div>
                <div class="order-items-list">
                    ${itemsHtml}
                </div>
                <div class="order-total">
                    รวมทั้งสิ้น: ฿${order.total.toFixed(2)}
                </div>
            </div>
        `;
    });

    ordersContainer.innerHTML = html;
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadOrderHistory();
});
