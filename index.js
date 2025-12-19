// Product database
const products = [
  {
    id: 1,
    name: 'ROSELLE ✨',
    desc: 'Peach gloss',
    price: 4500,
    productRef: 'RS-001'
  },
  {
    id: 2,
    name: 'ZYANA ✨',
    desc: 'Brown gloss',
    price: 4500,
    productRef: 'ZY-002'
  },
  {
    id: 3,
    name: 'GARNET ✨',
    desc: 'Red gloss',
    price: 4500,
    productRef: 'GA-003'
  },
  {
    id: 4,
    name: 'SORÉ ✨',
    desc: 'Shimmer gloss',
    price: 4500,
    productRef: 'SO-004'
  },
  {
    id: 5,
    name: 'VELORA ✨',
    desc: 'Pink gloss',
    price: 4500,
    productRef: 'VE-005'
  },
  {
    id: 6,
    name: 'LUMI ✨',
    desc: 'Clear gloss',
    price: 4500,
    productRef: 'LU-006'
  },
  {
    id: 7,
    name: 'CRESSIA ✨',
    desc: 'Minty lip oil',
    price: 4000,
    productRef: 'CR-007'
  },
  {
    id: 8,
    name: 'MELORA ✨',
    desc: 'Pink lip oil',
    price: 4000,
    productRef: 'ME-008'
  },
  {
    id: 9,
    name: 'TROPIA ✨',
    desc: 'Pineapple flavoured lip balm',
    price: 2500,
    productRef: 'TR-009'
  },
  {
    id: 10,
    name: 'COCO GLOW ✨',
    desc: 'Body shimmer oil',
    price: 10000,
    productRef: 'CG-010'
  },
  {
    id: 11,
    name: 'The Collection ✨',
    desc: 'Three lip glosses & two lip oils',
    price: 21500,
    productRef: 'TC-011'
  },
  {
    id: 12,
    name: 'The Complete Collection ✨',
    desc: 'Three lip glosses, two lip oils & more',
    price: 24000,
    productRef: 'TCC-012'
  }
];

let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  updateCartUI();
  setupEventListeners();
  setupMobileMenu();
});

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showSimpleCartNotification(product.name);
}


// Show a simple notification when an item is added to cart
function showSimpleCartNotification(productName) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--primary, #E75480);
    color: white;
    padding: 14px 22px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 3000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-size: 1rem;
    animation: slideInRight 300ms ease;
    max-width: 320px;
  `;
  notification.textContent = `✓ ${productName} added to cart!`;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 300ms ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotal.textContent = '₦0.00';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <div style="display: flex; align-items: center; gap: 8px; margin: 6px 0;">
            <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, -1)">-</button>
            <span>Qty: ${item.quantity}</span>
            <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
          </div>
          <p style="font-size: 0.85rem; color: #ff4fa8; font-weight: 600;">Ref: ${item.productRef}</p>
        </div>
        <div class="cart-item-price">₦${(item.price * item.quantity).toFixed(2)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₦${total.toFixed(2)}`;
  }

// Add quantity change handler
window.changeCartQty = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }
  saveCartToStorage();
  updateCartUI();
}
}

// Generate payment reference
function generatePaymentRef() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let ref = 'GLOSS-';
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const paymentRef = generatePaymentRef();
  const paymentRefElement = document.getElementById('paymentRef');
  if (!paymentRefElement) {
    alert('Checkout modal not found on this page');
    return;
  }
  paymentRefElement.textContent = paymentRef;

  // Show order summary in checkout modal
  const orderSummary = document.getElementById('orderSummary');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const productReferencesField = document.querySelector('textarea[name="productReferences"]');
  
  if (!orderSummary || !checkoutTotal || !productReferencesField) {
    alert('Checkout form elements not found');
    return;
  }

  let summaryHTML = '';
  let total = 0;
  let productRefs = [];

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    productRefs.push(item.productRef);
    summaryHTML += `
      <div class="summary-item">
        <div>
          <span>${item.name} x ${item.quantity}</span>
          <div style="font-size: 0.85rem; color: #ff4fa8; font-weight: 600; margin-top: 4px;">Ref: ${item.productRef}</div>
        </div>
        <span>₦${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  orderSummary.innerHTML = summaryHTML;
  checkoutTotal.textContent = `₦${total.toFixed(2)}`;
  
  // Auto-fill product references with real names and quantity in brackets
  const productNames = cart.map(item => `${item.productRef} (${item.name} x${item.quantity})`);
  productReferencesField.value = productNames.join(', ');

  // Close cart and open checkout
  closeCart();
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.style.display = 'block';
  }
}

// Close cart modal
function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

// Close checkout modal
function closeCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

// Setup event listeners
// Handle payment form submission
function handlePaymentFormSubmit(event) {
  event.preventDefault();
  console.log('handlePaymentFormSubmit called');
  
  const paymentForm = document.getElementById('paymentForm');
  
  if (!paymentForm) {
    console.log('Payment form not found');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paymentRef = document.getElementById('paymentRef')?.textContent || '';

  const name = paymentForm.querySelector('input[name="name"]')?.value.trim() || '';
  const email = paymentForm.querySelector('input[name="email"]')?.value.trim() || '';
  const street = paymentForm.querySelector('input[name="street"]')?.value.trim() || '';
  const city = paymentForm.querySelector('input[name="city"]')?.value.trim() || '';
  const state = paymentForm.querySelector('input[name="state"]')?.value.trim() || '';
  const postalcode = paymentForm.querySelector('input[name="postalcode"]')?.value.trim() || '';
  const country = paymentForm.querySelector('input[name="country"]')?.value.trim() || '';
  const paymentMethod = paymentForm.querySelector('textarea[name="paymentNotes"]')?.value.trim() || '';
  const fileInput = paymentForm.querySelector('input[name="paymentScreenshot"]');
  
  console.log('Form values:', { name, email, street, city, state, postalcode, country, paymentMethod, fileCount: fileInput?.files.length });
  
  // Check if all required fields are filled
  if (!name || !email || !street || !city || !state || !postalcode || !country || !paymentMethod || !fileInput?.files.length) {
    console.log('Form validation failed');
    alert('Please fill in all required fields and upload a payment screenshot');
    return;
  }
  
  // Validate name has at least 3 words (first, middle, last)
  const nameWords = name.split(/\s+/).filter(word => word.length > 0);
  if (nameWords.length < 3) {
    console.log('Name validation failed - less than 3 words');
    alert('Input your name as shown on your bank (First Middle Last)');
    return;
  }

  console.log('Form validation passed, submitting...');
  // Create FormData with file
  const formData = new FormData(paymentForm);
  
  // Add FormSubmit configuration
  formData.append('_captcha', 'false');
  formData.append('_next', window.location.href);
  
  // Submit to FormSubmit via fetch
  fetch('https://formsubmit.co/glossology001@gmail.com', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    console.log('Response status:', response.status);
    handlePaymentSuccess(paymentForm, name, email, paymentRef, total);
  }).catch(error => {
    console.error('Form submission error:', error);
    // Even if fetch fails, save locally and show success
    console.log('Saving payment locally due to network error');
    handlePaymentSuccess(paymentForm, name, email, paymentRef, total);
  });
}

// Handle contact form submission
function handleContactFormSubmit(event) {
  event.preventDefault();
  console.log('handleContactFormSubmit called');
  
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) {
    console.log('Contact form not found');
    return;
  }
  
  const firstname = contactForm.querySelector('input[name="firstname"]')?.value.trim() || '';
  const lastname = contactForm.querySelector('input[name="lastname"]')?.value.trim() || '';
  const email = contactForm.querySelector('input[name="email"]')?.value.trim() || '';
  const phone = contactForm.querySelector('input[name="phone"]')?.value.trim() || '';
  const inquiryType = contactForm.querySelector('select[name="inquiryType"]')?.value || '';
  const message = contactForm.querySelector('textarea[name="message"]')?.value.trim() || '';
  
  console.log('Form values:', { firstname, lastname, email, phone, inquiryType, message });
  
  // Check if all fields are filled
  if (!firstname || !lastname || !email || !phone || !inquiryType || !message) {
    console.log('Validation failed - empty fields');
    alert('Please fill in all required form fields');
    return;
  }
  
  // Validate email format
  if (!email.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }
  
  console.log('Validation passed, submitting form');
  const name = `${firstname} ${lastname}`;
  const formData = new FormData(contactForm);
  
  fetch('https://formsubmit.co/glossology001@gmail.com', {
    method: 'POST',
    body: formData
  }).then(response => {
    console.log('Form submitted successfully');
    showContactSuccess(name, email);
    contactForm.reset();
  }).catch(error => {
    console.error('Error submitting form:', error);
    alert('Error sending message. Please try again.');
  });
}

function setupEventListeners() {
  console.log('setupEventListeners called');
  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const checkoutModal = document.getElementById('checkoutModal');
  const paymentForm = document.getElementById('paymentForm');
  const contactForm = document.getElementById('contactForm');
  const fileInput = document.querySelector('input[name="paymentScreenshot"]');
  
  console.log('Elements found:', { cartIcon: !!cartIcon, cartModal: !!cartModal, checkoutModal: !!checkoutModal, paymentForm: !!paymentForm, contactForm: !!contactForm, fileInput: !!fileInput });

  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', () => {
      cartModal.style.display = 'block';
    });
  }

  // Show filename when file is selected
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const label = fileInput.closest('.file-input-label');
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // Create preview container if it doesn't exist
          let preview = document.getElementById('filePreview');
          if (!preview) {
            preview = document.createElement('div');
            preview.id = 'filePreview';
            preview.style.cssText = `
              margin-top: 1rem;
              text-align: center;
              padding: 1rem;
              background: #f9f9f9;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
              position: relative;
              display: inline-block;
              margin-left: auto;
              margin-right: auto;
            `;
            label.parentNode.insertBefore(preview, label.nextSibling);
          }
          
          // Show preview image with X button overlay
          preview.innerHTML = `
            <div style="position: relative; display: inline-block;">
              <img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <button type="button" onclick="document.querySelector('input[name=\\\"paymentScreenshot\\\"]').value=''; document.getElementById('filePreview').remove(); document.querySelector('.file-input-label span').textContent='📸 Upload Payment Screenshot (Optional)'" style="position: absolute; top: -8px; right: -8px; background: #ff4fa8; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">×</button>
            </div>
          `;
          
          label.querySelector('span').textContent = `✓ File selected`;
        };
        
        reader.readAsDataURL(file);
      } else {
        // Remove preview if no file selected
        const preview = document.getElementById('filePreview');
        if (preview) preview.remove();
        label.querySelector('span').textContent = '📸 Upload Payment Screenshot (Optional)';
      }
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (cartModal && event.target === cartModal) {
      cartModal.style.display = 'none';
    }
    if (checkoutModal && event.target === checkoutModal) {
      checkoutModal.style.display = 'none';
    }
  });

  // Contact form listener removed - using onclick handler instead
}

function handlePaymentSuccess(paymentForm, name, email, paymentRef, total) {
  // Save to local storage
  const fullAddress = [
    paymentForm.querySelector('input[name="street"]')?.value || '',
    paymentForm.querySelector('input[name="city"]')?.value || '',
    paymentForm.querySelector('input[name="state"]')?.value || '',
    paymentForm.querySelector('input[name="postalcode"]')?.value || '',
    paymentForm.querySelector('input[name="country"]')?.value || ''
  ].filter(part => part).join(', ');
  
  const payment = {
    name, email, 
    address: fullAddress,
    paymentMethod: paymentForm.querySelector('textarea[name="paymentNotes"]')?.value || '',
    productReferences: paymentForm.querySelector('textarea[name="productReferences"]')?.value || '',
    total: `₦${total.toFixed(2)}`,
    reference: paymentRef,
    items: cart,
    timestamp: new Date().toLocaleString()
  };
  
  let payments = JSON.parse(localStorage.getItem('glossologyPayments') || '[]');
  payments.push(payment);
  localStorage.setItem('glossologyPayments', JSON.stringify(payments));

  console.log('Payment saved to local storage');

  // Show success message
  showPaymentSuccess(name, email, paymentRef, total);

  // Clear cart
  cart = [];
  saveCartToStorage();
  updateCartUI();
  closeCheckout();
  paymentForm.reset();
  
  // Remove file preview
  const preview = document.getElementById('filePreview');
  if (preview) preview.remove();

// Contact form listener removed - using onclick handler instead
}

// Show payment success message
function showPaymentSuccess(name, email, ref, total) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="color: #c31667; text-align: center; margin-bottom: 1rem;">✓ Payment Received!</h2>
      <div style="text-align: center; line-height: 1.8;">
        <p><strong>Thank you for your purchase, ${name}!</strong></p>
        <p>Your payment proof has been submitted successfully.</p>
        <p style="margin-top: 1.5rem; font-size: 0.95rem;">
          <strong>Order Reference:</strong> ${ref}<br>
          <strong>Amount:</strong> ₦${total.toFixed(2)}<br>
          <strong>Confirmation Email:</strong> ${email}
        </p>
        <p style="margin-top: 1.5rem; color: #6b2d4a; font-size: 0.9rem;">
          We'll verify your payment and contact you within 24 hours to confirm your order and arrange shipping.
        </p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.location.href='index.html'">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Show contact success message
function showContactSuccess(name, email) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="color: #c31667; text-align: center; margin-bottom: 1rem;">✓ Message Received!</h2>
      <div style="text-align: center; line-height: 1.8;">
        <p><strong>Thank you for reaching out, ${name}!</strong></p>
        <p>We've received your message and will get back to you soon.</p>
        <p style="margin-top: 1.5rem; font-size: 0.95rem;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin-top: 1.5rem; color: #6b2d4a; font-size: 0.9rem;">
          We'll respond to your inquiry within 24 hours.
        </p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="this.closest('.modal').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Storage management
function saveCartToStorage() {
  localStorage.setItem('glossologyCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem('glossologyCart');
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Mobile Menu Toggle
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (!hamburger) return; // If hamburger doesn't exist, skip
  
  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}
