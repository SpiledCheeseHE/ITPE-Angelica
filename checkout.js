document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const mainContent = document.getElementById('main-content');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', startCheckout);
    }
    
    function startCheckout() {
        cartSidebar.classList.remove('active');
        
        overlay.classList.add('active');
        
        const checkoutForm = createCheckoutForm();
        
        setTimeout(() => {
            mainContent.innerHTML = '';
            mainContent.appendChild(checkoutForm);
            overlay.classList.remove('active');
            
            initFormValidation();
        }, 500);
    }
    
    function createCheckoutForm() {
        const checkoutSection = document.createElement('section');
        checkoutSection.classList.add('checkout-section');
        
        const cart = getCartItems();
        const cartSummary = calculateCartSummary(cart);
        
        checkoutSection.innerHTML = `
            <div class="container">
                <h1 class="page-title">Checkout</h1>
                <div class="checkout-container">
                    <div class="checkout-form-container">
                        <form id="checkout-form">
                            <div class="form-section">
                                <h2>Shipping Information</h2>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="first-name">First Name<span class="required">*</span></label>
                                        <input type="text" id="first-name" name="first-name" required>
                                        <span class="error-message" id="first-name-error"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="last-name">Last Name<span class="required">*</span></label>
                                        <input type="text" id="last-name" name="last-name" required>
                                        <span class="error-message" id="last-name-error"></span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email Address<span class="required">*</span></label>
                                    <input type="email" id="email" name="email" required>
                                    <span class="error-message" id="email-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone Number<span class="required">*</span></label>
                                    <input type="tel" id="phone" name="phone" required>
                                    <span class="error-message" id="phone-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="address">Street Address<span class="required">*</span></label>
                                    <input type="text" id="address" name="address" required>
                                    <span class="error-message" id="address-error"></span>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="city">City<span class="required">*</span></label>
                                        <input type="text" id="city" name="city" required>
                                        <span class="error-message" id="city-error"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="state">State/Province<span class="required">*</span></label>
                                        <input type="text" id="state" name="state" required>
                                        <span class="error-message" id="state-error"></span>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="zip">ZIP/Postal Code<span class="required">*</span></label>
                                        <input type="text" id="zip" name="zip" required>
                                        <span class="error-message" id="zip-error"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="country">Country<span class="required">*</span></label>
                                        <select id="country" name="country" required>
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        <span class="error-message" id="country-error"></span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h2>Payment Information</h2>
                                <div class="payment-methods">
                                    <div class="payment-method">
                                        <input type="radio" id="credit-card" name="payment-method" value="credit-card" checked>
                                        <label for="credit-card">Credit Card</label>
                                    </div>
                                    <div class="payment-method">
                                        <input type="radio" id="paypal" name="payment-method" value="paypal">
                                        <label for="paypal">PayPal</label>
                                    </div>
                                </div>
                                
                                <div id="credit-card-form">
                                    <div class="form-group">
                                        <label for="card-number">Card Number<span class="required">*</span></label>
                                        <input type="text" id="card-number" name="card-number" placeholder="1234 5678 9012 3456" required>
                                        <span class="error-message" id="card-number-error"></span>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="expiry-date">Expiry Date<span class="required">*</span></label>
                                            <input type="text" id="expiry-date" name="expiry-date" placeholder="MM/YY" required>
                                            <span class="error-message" id="expiry-date-error"></span>
                                        </div>
                                        <div class="form-group">
                                            <label for="cvv">CVV<span class="required">*</span></label>
                                            <input type="text" id="cvv" name="cvv" placeholder="123" required>
                                            <span class="error-message" id="cvv-error"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="card-name">Name on Card<span class="required">*</span></label>
                                        <input type="text" id="card-name" name="card-name" required>
                                        <span class="error-message" id="card-name-error"></span>
                                    </div>
                                </div>
                                
                                <div id="paypal-form" style="display: none;">
                                    <p>You will be redirected to PayPal to complete your purchase after reviewing your order.</p>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h2>Additional Information</h2>
                                <div class="form-group">
                                    <label for="notes">Order Notes (optional)</label>
                                    <textarea id="notes" name="notes" placeholder="Special instructions for delivery or order"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" id="back-to-cart" class="btn secondary-btn">Back to Cart</button>
                                <button type="submit" id="place-order-btn" class="btn primary-btn">Place Order</button>
                            </div>
                        </form>
                    </div>
                    
                    

                        <div class="promo-code">
                            <input type="text" id="promo-code" placeholder="Promo Code">
                            <button class="btn secondary-btn" id="apply-promo">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return checkoutSection;
    }
    
    function getCartItems() {
        const cartItems = localStorage.getItem('cartItems');
        return cartItems ? JSON.parse(cartItems) : [];
    }
    
    function calculateCartSummary(cart) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 100 ? 0 : 10;
        const total = subtotal + tax + shipping;
        
        return {
            subtotal,
            tax,
            shipping,
            total
        };
    }
    
    function renderCartItems(cart) {
        if (cart.length === 0) {
            return '<p>Your cart is empty.</p>';
        }
        
        return cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="order-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
    }
    
    function initFormValidation() {
        const checkoutForm = document.getElementById('checkout-form');
        const backToCartBtn = document.getElementById('back-to-cart');
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        const creditCardForm = document.getElementById('credit-card-form');
        const paypalForm = document.getElementById('paypal-form');
        const applyPromoBtn = document.getElementById('apply-promo');
        
        if (backToCartBtn) {
            backToCartBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
                setTimeout(() => {
                    const cartToggle = document.getElementById('cart-toggle');
                    if (cartToggle) {
                        cartToggle.click();
                    }
                }, 500);
            });
        }
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'credit-card') {
                    creditCardForm.style.display = 'block';
                    paypalForm.style.display = 'none';
                } else if (this.value === 'paypal') {
                    creditCardForm.style.display = 'none';
                    paypalForm.style.display = 'block';
                }
            });
        });
        
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', function() {
                const promoCode = document.getElementById('promo-code').value.trim();
                if (promoCode) {
                    if (promoCode === 'WELCOME10') {
                        const cart = getCartItems();
                        const cartSummary = calculateCartSummary(cart);
                        const discount = cartSummary.subtotal * 0.1;
                        
                        const orderTotals = document.querySelector('.order-totals');
                        
                        const discountRow = document.createElement('div');
                        discountRow.className = 'order-total-row discount';
                        discountRow.innerHTML = `
                            <span>Discount (10%):</span>
                            <span>-$${discount.toFixed(2)}</span>
                        `;
                        
                        const totalRow = document.querySelector('.order-total-row.total');
                        orderTotals.insertBefore(discountRow, totalRow);
                        
                        totalRow.querySelector('span:last-child').textContent = 
                            `$${(cartSummary.total - discount).toFixed(2)}`;
                        
                        document.getElementById('promo-code').disabled = true;
                        applyPromoBtn.disabled = true;
                        applyPromoBtn.textContent = 'Applied';
                        
                        const promoCodeContainer = document.querySelector('.promo-code');
                        const successMessage = document.createElement('p');
                        successMessage.className = 'success-message';
                        successMessage.textContent = 'Promo code applied successfully!';
                        promoCodeContainer.appendChild(successMessage);
                    } else {
                        const promoCodeContainer = document.querySelector('.promo-code');
                        const errorMessage = document.createElement('p');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Invalid promo code.';
                        promoCodeContainer.appendChild(errorMessage);
                        
                        setTimeout(() => {
                            errorMessage.remove();
                        }, 3000);
                    }
                }
            });
        }
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                if (validateCheckoutForm()) {
                    processOrder();
                }
            });
        }
    }
    
    function validateCheckoutForm() {
        let isValid = true;
        
        const requiredFields = [
            { id: 'first-name', errorMsg: 'Please enter your first name.' },
            { id: 'last-name', errorMsg: 'Please enter your last name.' },
            { id: 'email', errorMsg: 'Please enter a valid email address.', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            { id: 'phone', errorMsg: 'Please enter a valid phone number.', pattern: /^\d{10}$/ },
            { id: 'address', errorMsg: 'Please enter your street address.' },
            { id: 'city', errorMsg: 'Please enter your city.' },
            { id: 'state', errorMsg: 'Please enter your state/province.' },
            { id: 'zip', errorMsg: 'Please enter a valid ZIP/postal code.', pattern: /^\d{5}(-\d{4})?$/ },
            { id: 'country', errorMsg: 'Please select your country.' }
        ];
        
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (paymentMethod === 'credit-card') {
            requiredFields.push(
                { id: 'card-number', errorMsg: 'Please enter a valid card number.', pattern: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/ },
                { id: 'expiry-date', errorMsg: 'Please enter a valid expiry date (MM/YY).', pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/ },
                { id: 'cvv', errorMsg: 'Please enter a valid CVV.', pattern: /^\d{3,4}$/ },
                { id: 'card-name', errorMsg: 'Please enter the name on your card.' }
            );
        }
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(`${field.id}-error`);
            
            if (!input.value.trim()) {
                errorElement.textContent = field.errorMsg;
                input.classList.add('error');
                isValid = false;
            } else if (field.pattern && !field.pattern.test(input.value.trim())) {
                errorElement.textContent = field.errorMsg;
                input.classList.add('error');
                isValid = false;
            } else {
                errorElement.textContent = '';
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    function processOrder() {
        overlay.classList.add('active');
        
        setTimeout(() => {
            const formData = new FormData(document.getElementById('checkout-form'));
            const orderData = Object.fromEntries(formData.entries());
            
            const cart = getCartItems();
            
            const order = {
                id: generateOrderId(),
                date: new Date().toISOString(),
                customer: {
                    firstName: orderData['first-name'],
                    lastName: orderData['last-name'],
                    email: orderData.email,
                    phone: orderData.phone
                },
                shipping: {
                    address: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    zip: orderData.zip,
                    country: orderData.country
                },
                payment: {
                    method: orderData['payment-method'],
                    status: 'completed'
                },
                items: cart,
                summary: calculateCartSummary(cart),
                notes: orderData.notes || ''
            };
            
            saveOrder(order);
            
            clearCart();
            
            showOrderConfirmation(order);
        }, 2000);
    }
    
    function generateOrderId() {
        return 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    function saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    function clearCart() {
        localStorage.removeItem('cartItems');
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
    }
    
    function showOrderConfirmation(order) {
        const confirmationSection = document.createElement('section');
        confirmationSection.classList.add('order-confirmation');
        
        confirmationSection.innerHTML = `
            <div class="container">
                <div class="confirmation-content">
                    <div class="confirmation-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h1>Thank You for Your Order!</h1>
                    <p>Your order has been received and is being processed.</p>
                    <div class="order-details">
                        <div class="order-detail">
                            <span>Order Number:</span>
                            <span>${order.id}</span>
                        </div>
                        <div class="order-detail">
                            <span>Order Date:</span>
                            <span>${new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div class="order-detail">
                            <span>$${order.summary.total.toFixed(2)}</span>
                        </div>
                        <div class="order-detail">
                            <span>Payment Method:</span>
                            <span>${order.payment.method === 'credit-card' ? 'Credit Card' : 'PayPal'}</span>
                        </div>
                    </div>
                    <p>A confirmation email has been sent to ${order.customer.email}.</p>
                    <div class="confirmation-actions">
                        <a href="index.html" class="btn primary-btn">Continue Shopping</a>
                        <a href="#" class="btn secondary-btn" id="view-order">View Order Details</a>
                    </div>
                </div>
            </div>
        `;
        
        mainContent.innerHTML = '';
        mainContent.appendChild(confirmationSection);
        overlay.classList.remove('active');
        const viewOrderBtn = document.getElementById('view-order');
        if (viewOrderBtn) {
            viewOrderBtn.addEventListener('click', function(event) {
                event.preventDefault();
                alert('Order details functionality would be implemented here.');
            });
        }
    }
});