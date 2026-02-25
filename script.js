// Dummy Product Data
const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics', rating: 4.5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 2, name: 'Smart Watch', price: 199.99, category: 'electronics', rating: 4.8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 3, name: 'Laptop', price: 899.99, category: 'electronics', rating: 4.7, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },
    { id: 4, name: 'Casual T-Shirt', price: 24.99, category: 'clothing', rating: 4.3, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
    { id: 5, name: 'Denim Jacket', price: 59.99, category: 'clothing', rating: 4.6, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },
    { id: 6, name: 'Summer Dress', price: 49.99, category: 'clothing', rating: 4.4, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500' },
    { id: 7, name: 'Running Shoes', price: 89.99, category: 'shoes', rating: 4.7, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { id: 8, name: 'Sneakers', price: 69.99, category: 'shoes', rating: 4.5, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500' },
    { id: 9, name: 'Bluetooth Speaker', price: 45.99, category: 'electronics', rating: 4.4, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
    { id: 10, name: 'Formal Shoes', price: 79.99, category: 'shoes', rating: 4.6, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500' }
];

// Cart Array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Generate Star Rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

// Display Products
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid') || document.getElementById('featuredProducts');
    if (!grid) return;

    grid.innerHTML = productsToShow.map(product => `
        <div class="col-md-4 col-sm-6">
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="rating mb-2">${generateStars(product.rating)}</div>
                    <p class="product-price">$${product.price}</p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

// Display Cart Items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItems) return;

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="row align-items-center">
                <div class="col-md-2 col-sm-12">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="col-md-3 col-sm-12">
                    <h5>${item.name}</h5>
                </div>
                <div class="col-md-2 col-sm-12">
                    <p class="mb-0">$${item.price}</p>
                </div>
                <div class="col-md-3 col-sm-12">
                    <div class="quantity-controls d-flex align-items-center justify-content-center gap-2">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="mx-3 fw-bold">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="col-md-2 col-sm-12">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartTotal();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Update Cart Total
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Search and Filter
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filtered = products;

    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    displayProducts(filtered);
}

// Login Form Validation
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (email && password) {
                alert('Login successful!');
                window.location.href = 'index.html';
            }
        });
    }
}

// Register Form Validation
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters!');
                return;
            }

            alert('Registration successful!');
            window.location.href = 'login.html';
        });
    }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Home Page
    if (document.getElementById('featuredProducts')) {
        displayProducts(products.slice(0, 6));
    }

    // Products Page
    if (document.getElementById('productsGrid')) {
        displayProducts(products);
        setupSearchAndFilter();
    }

    // Cart Page
    if (document.getElementById('cartItems')) {
        displayCart();
    }

    // Login & Register
    setupLoginForm();
    setupRegisterForm();
});
