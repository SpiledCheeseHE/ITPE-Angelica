document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 800);

    initNavigation();
    initCart();
    initSearch();
    loadFeaturedProducts();
    loadDealsProducts();
    loadTestimonials();
    initNewsletterForm();
    initCountdown();
}

function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('overlay');
    
    if (mobileMenuToggle && navLinks && overlay) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }
    
    const profileToggle = document.getElementById('profile-toggle');
    const profileMenu = document.getElementById('profile-menu');
    
    if (profileToggle && profileMenu) {
        profileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            profileMenu.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (navLinks) navLinks.classList.remove('active');
            if (profileMenu) profileMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    const navItems = document.querySelectorAll('[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelectorAll(`.nav-links a[data-page="${page}"]`).forEach(link => {
                link.classList.add('active');
            });
            console.log(`Navigating to: ${page}`);
            if (navLinks) navLinks.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

function initCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const checkoutBtn = document.getElementById('checkout-btn');
    window.cartItems = [
    ];
    
    if (cartToggle && cartSidebar && overlay) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            updateCartDisplay();
        });
    }
    
    if (closeCart && cartSidebar && overlay) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay && cartSidebar) {
        overlay.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            console.log('Proceeding to checkout...');
            alert('Proceeding to checkout with ' + window.cartItems.length + ' items');
        });
    }
    window.updateCartDisplay = function() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total-amount');
        
        if (!cartItemsContainer || !cartCount || !cartSubtotal || !cartTax || !cartTotal) return;
        
        cartCount.textContent = window.cartItems.reduce((total, item) => total + item.quantity, 0);
        cartItemsContainer.innerHTML = '';
        
        if (window.cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartSubtotal.textContent = '₱0.00';
            cartTax.textContent = '₱0.00';
            cartTotal.textContent = '₱0.00';
            return;
        }
        
        window.cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₱${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        const subtotal = window.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; 
        const total = subtotal + tax;       
        
        cartSubtotal.textContent = `₱${subtotal.toFixed(2)}`;
        cartTax.textContent = `₱${tax.toFixed(2)}`;
        cartTotal.textContent = `₱${total.toFixed(2)}`;
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const itemIndex = window.cartItems.findIndex(item => item.id === id);
                
                if (itemIndex !== -1) {
                    window.cartItems[itemIndex].quantity++;
                    window.updateCartDisplay();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const itemIndex = window.cartItems.findIndex(item => item.id === id);
                
                if (itemIndex !== -1 && window.cartItems[itemIndex].quantity > 1) {
                    window.cartItems[itemIndex].quantity--;
                    window.updateCartDisplay();
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const index = window.cartItems.findIndex(item => item.id === id);  
                if (index !== -1) {
                    window.cartItems.splice(index, 1);
                    window.updateCartDisplay();
                }
            });
        });
    };
    window.updateCartDisplay();
}

function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const overlay = document.getElementById('overlay');
    
    if (searchToggle && searchModal && overlay) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.classList.add('active');
            overlay.classList.add('active');
            if (searchInput) searchInput.focus();
        });
    }
    
    if (closeSearch && searchModal && overlay) {
        closeSearch.addEventListener('click', function() {
            searchModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay && searchModal) {
        overlay.addEventListener('click', function() {
            searchModal.classList.remove('active');
        });
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        if (!searchInput || !searchModal || !overlay) return;
        
        const query = searchInput.value.trim();
        
        if (query.length > 0) {
            console.log(`Searching for: ${query}`);
            alert(`Searching for: ${query}`);
            searchModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
}

function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) {
        console.error('Featured products container not found');
        return;
    }
    
    const featuredProducts = [
        {
            id: 1,
            name: "Wireless Noise-Cancelling Headphones",
            price: 2679.99,
            originalPrice: 5399.46,
            image: "headset.jpg",
            rating: 4.5,
            reviewCount: 128
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            price: 3129.99,
            originalPrice: 8099.46,
            image: "watch.jpg",
            rating: 4.7,
            reviewCount: 245
        },
        {
            id: 3,
            name: "Portable Bluetooth Speaker",
            price: 1249.99,
            originalPrice: 3779.46,
            image: "speaker.webp",
            rating: 4.3,
            reviewCount: 76
        },
        {
            id: 4,
            name: "Ultra HD Smart TV - 55\"",
            price: 25499.99,
            originalPrice: 35099.46,
            image: "tv.jpg",
            rating: 4.8,
            reviewCount: 312
        }
    ];
    
    featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">${discount}% OFF</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="product-action add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="product-action add-to-wishlist" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars" style="--rating: ${product.rating};"></div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₱${product.price.toFixed(2)}</span>
                    <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                </div>
            </div>
        `;
        featuredProductsContainer.appendChild(productCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = featuredProducts.find(p => p.id === productId) || 
                            dealsProducts.find(p => p.id === productId);
            
            if (product) {
                const existingItemIndex = window.cartItems.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    window.cartItems[existingItemIndex].quantity++;
                } else {
                    window.cartItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                console.log(`Adding product #${productId} to cart`);
                alert(`${product.name} added to cart!`);
                if (document.getElementById('cart-sidebar').classList.contains('active')) {
                    window.updateCartDisplay();
                }
            }
        });
    });
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`Adding product #${productId} to wishlist`);
            this.querySelector('i').classList.toggle('far');
            this.querySelector('i').classList.toggle('fas');
            alert(`Product added to wishlist!`);
        });
    });
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`Quick view for product #${productId}`);
            alert(`Quick view for product #${productId}`);
        });
    });
}

function loadDealsProducts() {
    const dealsProductsContainer = document.getElementById('deals-products');
    if (!dealsProductsContainer) {
        console.error('Deals products container not found');
        return;
    }
    window.dealsProducts = [
        {
            id: 5,
            name: "Smart Home Security Camera",
            price: 2169.99,
            originalPrice: 6479.46,
            image: "camera.webp",
            rating: 4.6,
            reviewCount: 93
        },
        {
            id: 6,
            name: "Coffee Maker with Grinder",
            price: 1089.99,
            originalPrice: 8099.46,
            image: "coffee maker.jpg",
            rating: 4.4,
            reviewCount: 156
        },
        {
            id: 7,
            name: "Robot Vacuum Cleaner",
            price: 11999.99,
            originalPrice: 18899.46,
            image: "vacuum.webp",
            rating: 4.7,
            reviewCount: 208
        },
        {
            id: 8,
            name: "Air Purifier with HEPA Filter",
            price: 1229.99,
            originalPrice: 10799.46,
            image: "purifier.jpg",
            rating: 4.5,
            reviewCount: 137
        }
    ];
    
    dealsProductsContainer.innerHTML = '';
    window.dealsProducts.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);      
        const productCard = document.createElement('div');
        productCard.className = 'product-card deal-card';
        productCard.innerHTML = `
            <div class="product-badge hot-deal">HOT DEAL - ${discount}% OFF</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="product-action add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="product-action add-to-wishlist" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars" style="--rating: ${product.rating};"></div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₱${product.price.toFixed(2)}</span>
                    <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                </div>
            </div>
        `;
        dealsProductsContainer.appendChild(productCard);
    });
    document.querySelectorAll('.deal-card .add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = window.dealsProducts.find(p => p.id === productId);
            
            if (product) {
                const existingItemIndex = window.cartItems.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    window.cartItems[existingItemIndex].quantity++;
                } else {
                    window.cartItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                console.log(`Adding product #${productId} to cart`);
                alert(`${product.name} added to cart!`);
                if (document.getElementById('cart-sidebar').classList.contains('active')) {
                    window.updateCartDisplay();
                }
            }
        });
    });
    document.querySelectorAll('.deal-card .add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`Adding product #${productId} to wishlist`);
            this.querySelector('i').classList.toggle('far');
            this.querySelector('i').classList.toggle('fas');
            alert(`Product added to wishlist!`);
        });
    });
    document.querySelectorAll('.deal-card .quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`Quick view for product #${productId}`);
            alert(`Quick view for product #${productId}`);
        });
    });
}

function loadTestimonials() {
    const testimonialSlider = document.getElementById('testimonial-slider');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!testimonialSlider || !prevBtn || !nextBtn) return;
    
    const testimonials = [
        {
            name: "Revelyn Doromal",
            comment: "ShopEase has the best customer service I've experienced. My order arrived faster than expected and the quality was excellent.",
            rating: 5
        },
        {
            name: "Kershiane Rose Itucas",
            comment: "I love the wide variety of products and competitive prices. The website is so easy to navigate!",
            rating: 5
        },
        {
            name: "Angelica Tirador",
            comment: "The return process was smooth and hassle-free. Will definitely shop here again!",
            rating: 4
        }
    ];
    
    testimonialSlider.innerHTML = '';
    testimonials.forEach((testimonial, index) => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.style.display = index === 0 ? 'block' : 'none';
        testimonialCard.dataset.index = index;
        
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            starsHTML += `<i class="fas fa-star ${i < testimonial.rating ? 'filled' : ''}"></i>`;
        }
        
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-stars">
                    ${starsHTML}
                </div>
                <p class="testimonial-text">"${testimonial.comment}"</p>
            </div>
            <div class="testimonial-author">
                <div class="testimonial-author-image">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                </div>
                <div class="testimonial-author-name">${testimonial.name}</div>
            </div>
        `;
        testimonialSlider.appendChild(testimonialCard);
    });
    
    let currentTestimonial = 0;
    
    prevBtn.addEventListener('click', function() {
        showTestimonial(currentTestimonial - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        showTestimonial(currentTestimonial + 1);
    });
    
    function showTestimonial(index) {
        const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
        
        if (index < 0) {
            index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
            index = 0;
        }
        
        testimonialCards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });
        
        currentTestimonial = index;
    }
    
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (email) {
                console.log(`Newsletter subscription for: ${email}`);
                alert(`Thank you for subscribing to our newsletter!`);
                this.reset();
            }
        });
    }
}

function initCountdown() {
    const countdownElement = document.getElementById('deals-countdown');
    if (!countdownElement) return;
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.textContent = 
            (hours < 10 ? '0' + hours : hours) + ':' +
            (minutes < 10 ? '0' + minutes : minutes) + ':' +
            (seconds < 10 ? '0' + seconds : seconds);
            
        if (distance < 0) {
            clearInterval(countdownInterval);
            endTime.setHours(endTime.getHours() + 24);
            initCountdown();
        }
    }, 1000);
}
window.wishlistItems = [];
function loadCategoryProducts() {
    const categoryProducts = {
        electronics: [
            {
                id: 101,
                name: "Bluetooth Earbuds",
                price: 899.99,
                originalPrice: 1499.99,
                image: "earbuds.jpg",
                rating: 4.6,
                reviewCount: 87
            },
            {
                id: 102,
                name: "Gaming Laptop",
                price: 55999.99,
                originalPrice: 69999.99,
                image: "laptop.jpg",
                rating: 4.8,
                reviewCount: 134
            },
            {
                id: 103,
                name: "Smartphone",
                price: 18999.99,
                originalPrice: 24999.99,
                image: "smartphone.webp",
                rating: 4.7,
                reviewCount: 256
            },
            {
                id: 104,
                name: "Wireless Charger",
                price: 699.99,
                originalPrice: 1099.99,
                image: "wireless charger.jpg",
                rating: 4.4,
                reviewCount: 92
            }
        ],
        fashion: [
            {
                id: 201,
                name: "Casual Sneakers",
                price: 1599.99,
                originalPrice: 2499.99,
                image: "sneakers.webp",
                rating: 4.5,
                reviewCount: 78
            },
            {
                id: 202,
                name: "Denim Jacket",
                price: 1899.99,
                originalPrice: 2799.99,
                image: "denim jacket.webp",
                rating: 4.3,
                reviewCount: 65
            },
            {
                id: 203,
                name: "Leather Handbag",
                price: 2499.99,
                originalPrice: 3999.99,
                image: "leather handbag.jpg",
                rating: 4.7,
                reviewCount: 112
            },
            {
                id: 204,
                name: "Sunglasses",
                price: 799.99,
                originalPrice: 1299.99,
                image: "glasses.jpg",
                rating: 4.4,
                reviewCount: 54
            }
        ],
        home: [
            {
                id: 301,
                name: "Aromatherapy Diffuser",
                price: 899.99,
                originalPrice: 1499.99,
                image: "diffuser.webp",
                rating: 4.6,
                reviewCount: 123
            },
            {
                id: 302,
                name: "Standing Desk",
                price: 8999.99,
                originalPrice: 12999.99,
                image: "desk.jpg",
                rating: 4.8,
                reviewCount: 74
            },
            {
                id: 303,
                name: "Memory Foam Pillow",
                price: 799.99,
                originalPrice: 1299.99,
                image: "memory pillow.webp",
                rating: 4.7,
                reviewCount: 186
            },
            {
                id: 304,
                name: "Smart Light Bulbs (Set of 4)",
                price: 1199.99,
                originalPrice: 1999.99,
                image: "bulb.webp",
                rating: 4.5,
                reviewCount: 93
            }
        ],
        beauty: [
            {
                id: 401,
                name: "Facial Serum",
                price: 1299.99,
                originalPrice: 1999.99,
                image: "serum.avif",
                rating: 4.8,
                reviewCount: 142
            },
            {
                id: 402,
                name: "Hair Styling Tools Set",
                price: 2499.99,
                originalPrice: 3999.99,
                image: "hairstyling.jpg",
                rating: 4.6,
                reviewCount: 87
            },
            {
                id: 403,
                name: "Makeup Palette",
                price: 1599.99,
                originalPrice: 2299.99,
                image: "makeup palette.jpg",
                rating: 4.7,
                reviewCount: 128
            },
            {
                id: 404,
                name: "Skincare Gift Set",
                price: 1899.99,
                originalPrice: 2999.99,
                image: "skincare.webp",
                rating: 4.9,
                reviewCount: 74
            }
        ]
    };

    window.allCategoryProducts = categoryProducts;
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    const featuredCategories = document.querySelector('.featured-categories');
    if (!featuredCategories) return;
    const nextSection = featuredCategories.nextElementSibling;
    
    Object.keys(categoryProducts).forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.className = `category-products ${category}-products`;
        categorySection.id = `${category}-products-section`;
        
        const sectionHTML = `
            <div class="container">
                <h2 class="section-title">${category.charAt(0).toUpperCase() + category.slice(1)} Products</h2>
                <div class="product-grid" id="${category}-products"></div>
                <div class="view-more-container">
                    <a href="#" class="btn secondary-btn" data-category="${category}"> ${category.charAt(0).toUpperCase() + category.slice(1)}</a>
                </div>
            </div>
        `;
        
        categorySection.innerHTML = sectionHTML;
        mainContent.insertBefore(categorySection, nextSection);
        const productGrid = document.getElementById(`${category}-products`);
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        categoryProducts[category].forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-badge">${discount}% OFF</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="product-action add-to-cart" data-id="${product.id}" data-category="${category}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="product-action add-to-wishlist" data-id="${product.id}" data-category="${category}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="product-action quick-view" data-id="${product.id}" data-category="${category}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars" style="--rating: ${product.rating};"></div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₱${product.price.toFixed(2)}</span>
                        <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    });
    
    attachCategoryProductEvents();
}

function attachCategoryProductEvents() {
    document.querySelectorAll('.category-products .add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const category = this.getAttribute('data-category');
            const product = window.allCategoryProducts[category].find(p => p.id === productId);
            
            if (product) {
                const existingItemIndex = window.cartItems.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    window.cartItems[existingItemIndex].quantity++;
                } else {
                    window.cartItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                console.log(`Adding product #${productId} from ${category} to cart`);
                alert(`${product.name} added to cart!`);
                if (document.getElementById('cart-sidebar').classList.contains('active')) {
                    window.updateCartDisplay();
                }
            }
        });
    });
    document.querySelectorAll('.category-products .add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const category = this.getAttribute('data-category');
            const product = window.allCategoryProducts[category].find(p => p.id === productId);
            
            if (product) {
                const existingItemIndex = window.wishlistItems.findIndex(item => item.id === productId);
                if (existingItemIndex !== -1) {
                    window.wishlistItems.splice(existingItemIndex, 1);
                    this.querySelector('i').classList.remove('fas');
                    this.querySelector('i').classList.add('far');
                    alert(`${product.name} removed from wishlist!`);
                } else {
                    window.wishlistItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                        category: category
                    });
                    this.querySelector('i').classList.remove('far');
                    this.querySelector('i').classList.add('fas');
                    alert(`${product.name} added to wishlist!`);
                }
                
                console.log(`Toggling product #${productId} from ${category} in wishlist`);
                updateWishlistCount();
            }
        });
    });
    document.querySelectorAll('.category-products .quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const category = this.getAttribute('data-category');
            console.log(`Quick view for product #${productId} from ${category}`);
            alert(`Quick view for product #${productId} from ${category}`);
        });
    });
    document.querySelectorAll('.view-more-container .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            console.log(`Viewing more ${category} products`);
            alert(`Navigate to all ${category} products page`);
        });
    });
}

function initWishlist() {
    if (!window.wishlistItems) {
        window.wishlistItems = [];
    }
    document.querySelectorAll('#featured-products .add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const featuredProducts = document.querySelectorAll('#featured-products .product-card');
            let product;
            featuredProducts.forEach(featuredProduct => {
                const productIdBtn = featuredProduct.querySelector('.add-to-cart');
                if (productIdBtn && parseInt(productIdBtn.getAttribute('data-id')) === productId) {
                    const productName = featuredProduct.querySelector('.product-name').textContent;
                    const productPrice = parseFloat(featuredProduct.querySelector('.current-price').textContent.replace('₱', ''));
                    const productOriginalPrice = parseFloat(featuredProduct.querySelector('.original-price').textContent.replace('₱', ''));
                    const productImage = featuredProduct.querySelector('.product-image img').src;
                    const productRating = parseFloat(featuredProduct.querySelector('.stars').style.getPropertyValue('--rating'));
                    const productReviewCount = parseInt(featuredProduct.querySelector('.rating-count').textContent.replace(/[()]/g, ''));
                    
                    product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        originalPrice: productOriginalPrice,
                        image: productImage,
                        rating: productRating,
                        reviewCount: productReviewCount,
                        category: 'featured'
                    };
                }
            });
            
            if (product) {
                toggleWishlistItem(product, this);
            }
        });
    });
    document.querySelectorAll('#deals-products .add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = window.dealsProducts.find(p => p.id === productId);
            
            if (product) {
                product.category = 'deals';
                toggleWishlistItem(product, this);
            }
        });
    });
    
    updateWishlistMenu();
    const wishlistLink = document.querySelector('a[data-page="wishlist"]');
    if (wishlistLink) {
        wishlistLink.addEventListener('click', function(e) {
            e.preventDefault();
            showWishlistPage();
        });
    }
}
function toggleWishlistItem(product, button) {
    const existingItemIndex = window.wishlistItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        window.wishlistItems.splice(existingItemIndex, 1);
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
        alert(`${product.name} removed from wishlist!`);
    } else {
        window.wishlistItems.push(product);
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
        alert(`${product.name} added to wishlist!`);
    }
    
    console.log(`Toggling product #${product.id} in wishlist`);
    updateWishlistCount();
    updateWishlistMenu();
}

function updateWishlistCount() {
    const wishlistLink = document.querySelector('a[data-page="wishlist"]');
    if (wishlistLink) {
        const existingBadge = wishlistLink.querySelector('.wishlist-count');
        if (existingBadge) {
            existingBadge.remove();
        }
        if (window.wishlistItems.length > 0) {
            const countBadge = document.createElement('span');
            countBadge.className = 'wishlist-count';
            countBadge.textContent = window.wishlistItems.length;
            wishlistLink.appendChild(countBadge);
        }
    }
}
function updateWishlistMenu() {
    const profileMenu = document.getElementById('profile-menu');
    const wishlistLink = profileMenu ? profileMenu.querySelector('a[data-page="wishlist"]') : null;
    
    if (wishlistLink) {
        wishlistLink.innerHTML = `<i class="fas fa-heart"></i>Wishlist ${window.wishlistItems.length > 0 ? `(${window.wishlistItems.length})` : ''}`;
    }
}

function showWishlistPage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    if (!window.originalMainContent) {
        window.originalMainContent = mainContent.innerHTML;
    }
    
    mainContent.innerHTML = `
        <section class="wishlist-page">
            <div class="container">
                <h2 class="section-title">My Wishlist</h2>
                <div class="wishlist-header">
                    <span>${window.wishlistItems.length} items in your wishlist</span>
                    <button id="back-to-shopping" class="btn secondary-btn">Continue Shopping</button>
                </div>
                <div class="wishlist-grid" id="wishlist-grid">
                    ${window.wishlistItems.length === 0 ? 
                        '<div class="empty-wishlist"><p>Your wishlist is empty</p><a href="#" class="btn primary-btn" id="start-shopping">Start Shopping</a></div>' : 
                        ''}
                </div>
            </div>
        </section>
    `;
    
    if (window.wishlistItems.length > 0) {
        const wishlistGrid = document.getElementById('wishlist-grid');
        
        window.wishlistItems.forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card wishlist-card';
            productCard.innerHTML = `
                <div class="product-badge">${discount}% OFF</div>
                <button class="remove-from-wishlist" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="product-action add-to-cart" data-id="${product.id}" data-category="${product.category}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="product-action quick-view" data-id="${product.id}" data-category="${product.category}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars" style="--rating: ${product.rating};"></div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₱${product.price.toFixed(2)}</span>
                        <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `;
            wishlistGrid.appendChild(productCard);
        });
        
        attachWishlistEvents();
    }
    
    const backToShoppingBtn = document.getElementById('back-to-shopping');
    if (backToShoppingBtn) {
        backToShoppingBtn.addEventListener('click', function() {
            mainContent.innerHTML = window.originalMainContent;
            window.scrollTo(0, 0);
            loadFeaturedProducts();
            loadDealsProducts();
            loadTestimonials();
            loadCategoryProducts();
            initWishlist();
        });
    }
    const startShoppingBtn = document.getElementById('start-shopping');
    if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.innerHTML = window.originalMainContent;
            window.scrollTo(0, 0);
            loadFeaturedProducts();
            loadDealsProducts();
            loadTestimonials();
            loadCategoryProducts();
            initWishlist();
        });
    }
}

function attachWishlistEvents() {
    document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const existingItemIndex = window.wishlistItems.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                const productName = window.wishlistItems[existingItemIndex].name;
                window.wishlistItems.splice(existingItemIndex, 1);
                alert(`${productName} removed from wishlist!`);
                updateWishlistCount();
                updateWishlistMenu();
                showWishlistPage();
            }
        });
    });

    document.querySelectorAll('.wishlist-card .add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = window.wishlistItems.find(p => p.id === productId);
            
            if (product) {
                const existingItemIndex = window.cartItems.findIndex(item => item.id === productId);
                if (existingItemIndex !== -1) {
                    window.cartItems[existingItemIndex].quantity++;
                } else {
                    window.cartItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                console.log(`Adding product #${productId} from wishlist to cart`);
                alert(`${product.name} added to cart!`);
                window.updateCartDisplay();
            }
        });
    });
    
    document.querySelectorAll('.wishlist-card .quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`Quick view for product #${productId} from wishlist`);
            alert(`Quick view for product #${productId} from wishlist`);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const oldInitApp = window.initApp;
    window.initApp = function() {
        oldInitApp();
        loadCategoryProducts();
        initWishlist();
    };
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Wishlist Badge */
        .wishlist-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #e74c3c;
            color: white;
            font-size: 10px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Wishlist Page Styles */
        .wishlist-page {
            padding: 60px 0;
        }
        
        .wishlist-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .wishlist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
        }
        
        .empty-wishlist {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 0;
        }
        
        .empty-wishlist p {
            font-size: 18px;
            margin-bottom: 20px;
            color: #666;
        }
        
        .wishlist-card {
            position: relative;
        }
        
        .remove-from-wishlist {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            z-index: 2;
            transition: all 0.3s;
        }
        
        .remove-from-wishlist:hover {
            background-color: #e74c3c;
            color: white;
        }
        
        /* Category Products Sections */
        .category-products {
            padding: 60px 0;
            border-bottom: 1px solid #eee;
        }
        
        .view-more-container {
            text-align: center;
            margin-top: 30px;
        }
        
        /* Profile menu item positioning */
        .profile-menu li {
            position: relative;
        }
    `;
    
    document.head.appendChild(styleElement);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loadCategoryProducts();
        initWishlist();
    }
});

