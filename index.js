// EmailJS Configuration
console.log('🟢 index.js loaded - starting initialization');
emailjs.init('fnr58NGwdArmPUBPU');
console.log('🟢 EmailJS initialized');

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
  console.log('=== DOMContentLoaded fired ===');
  console.log('emailjs available?', typeof emailjs !== 'undefined');
  loadCartFromStorage();
  updateCartUI();
  setupEventListeners();
  setupMobileMenu();
  console.log('=== Initialization complete ===');
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

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

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

// Strict validation utilities
const VALIDATION_RULES = {
  email: /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-zA-Z]{2,}$/,
  phone: /^[\d\s\-\+\(\)]{10,20}$/,
  name: /^[a-zA-Z\s'-]{2,100}$/,
  alphabeticOnly: /^[a-zA-Z\s'-]{2,}$/,
  minLength: (len) => (val) => val.length >= len,
  maxLength: (len) => (val) => val.length <= len,
};

function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' };
  if (email.length > 254) return { valid: false, error: 'Email is too long' };
  if (!VALIDATION_RULES.email.test(email)) return { valid: false, error: 'Invalid email format' };
  if (email.includes('..')) return { valid: false, error: 'Email contains invalid characters' };
  return { valid: true };
}

function validatePhoneNumber(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return { valid: false, error: 'Phone number must have at least 10 digits' };
  if (cleaned.length > 15) return { valid: false, error: 'Phone number is too long' };
  if (!VALIDATION_RULES.phone.test(phone)) return { valid: false, error: 'Phone number contains invalid characters' };
  return { valid: true };
}

function validateName(name, fieldName = 'Name') {
  if (!name) return { valid: false, error: `${fieldName} is required` };
  if (name.length < 2) return { valid: false, error: `${fieldName} must be at least 2 characters` };
  if (name.length > 100) return { valid: false, error: `${fieldName} is too long (max 100 characters)` };
  if (!VALIDATION_RULES.alphabeticOnly.test(name)) return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens and apostrophes` };
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return { valid: false, error: `${fieldName} must have at least 2 words` };
  return { valid: true };
}

function validateAddress(address) {
  if (!address) return { valid: false, error: 'Address is required' };
  if (address.length < 5) return { valid: false, error: 'Address must be at least 5 characters' };
  if (address.length > 200) return { valid: false, error: 'Address is too long (max 200 characters)' };
  if (/<[^>]*>/g.test(address)) return { valid: false, error: 'Address contains invalid characters' };
  return { valid: true };
}

function validatePaymentNotes(notes) {
  if (!notes) return { valid: false, error: 'Payment method details are required' };
  if (notes.length < 5) return { valid: false, error: 'Payment details must be at least 5 characters' };
  if (notes.length > 500) return { valid: false, error: 'Payment details are too long (max 500 characters)' };
  if (/<[^>]*>/g.test(notes)) return { valid: false, error: 'Payment details contain invalid characters' };
  return { valid: true };
}

function validateFileUpload(fileInput) {
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    return { valid: false, error: 'Payment screenshot is required' };
  }
  
  const file = fileInput.files[0];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only image files (JPG, PNG, GIF, WebP) are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true };
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
  const name = paymentForm.querySelector('input[name="name"]')?.value.trim() || '';
  const email = paymentForm.querySelector('input[name="email"]')?.value.trim() || '';
  const address = paymentForm.querySelector('textarea[name="address"]')?.value.trim() || '';
  const city = paymentForm.querySelector('input[name="city"]')?.value.trim() || '';
  const state = paymentForm.querySelector('select[name="state"]')?.value || '';
  const paymentMethod = paymentForm.querySelector('textarea[name="paymentNotes"]')?.value.trim() || '';
  const fileInput = paymentForm.querySelector('input[name="paymentScreenshot"]');
  
  console.log('Form values:', {name, email, address, city, state, paymentMethod});

  // MINIMAL validation - just check fields exist
  if (!name || name.length < 2) {
    alert('Please enter your full name');
    return;
  }
  
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  const mobileNumber = paymentForm.querySelector('input[name="mobileNumber"]')?.value.trim() || '';
  if (!mobileNumber) {
    alert('Please enter your mobile number');
    return;
  }
  
  if (!address || address.length < 3) {
    alert('Please enter your address');
    return;
  }
  
  if (!city || city.length < 2) {
    alert('Please enter your city');
    return;
  }
  
  if (!state) {
    alert('Please select a state');
    return;
  }

  // Get delivery timeframe based on state
  const deliveryTimeframe = state === 'Lagos' ? '2-3 Working Days' : '5-7 Working Days (via GIG Logistics)';
  
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert('Please upload a payment screenshot');
    return;
  }

  console.log('All checks passed - sending emails...');
  
  // Generate order ID
  const orderId = 'ORD-' + Date.now();
  
  // Get product details
  const productsList = document.querySelector('textarea[name="productReferences"]')?.value || 'Not specified';
  
  // Get screenshot filename
  const screenshotFileName = fileInput.files[0]?.name || 'Unknown file';
  
  // Convert screenshot to Base64
  const screenshotFile = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const base64Screenshot = event.target.result;
    
    // Format order details for business owner email
    const orderDetailsForOwner = `
Customer Name: ${name}
Email: ${email}
Phone: ${mobileNumber}
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}

DELIVERY ADDRESS:
${address}
${city}, ${state}, Nigeria

DELIVERY TIMEFRAME:
${deliveryTimeframe}

ORDER ITEMS:
${productsList}

TOTAL AMOUNT: ₦${total.toLocaleString()}

PAYMENT METHOD:
${paymentMethod}

PAYMENT SCREENSHOT:
${screenshotFileName}
`;

    // Email 1: Customer Confirmation
    const customerEmailParams = {
      order_id: orderId,
      from_name: name,
      customer_email: email,
      address: address,
      city: city,
      state: state,
      country: 'Nigeria',
      payment_method: paymentMethod,
      products: productsList,
      product_total: `₦${total.toLocaleString()}`,
      payment_screenshot: screenshotFileName,
      email: email  // Send to customer
    };

    // Email 2: Business Owner Notification (with Base64 screenshot)
    const ownerEmailParams = {
      order_id: orderId,
      from_name: name,
      customer_email: email,
      mobile_number: mobileNumber,
      address: address,
      city: city,
      state: state,
      country: 'Nigeria',
      delivery_timeframe: deliveryTimeframe,
      payment_method: paymentMethod,
      products: productsList,
      total_amount: `₦${total.toLocaleString()}`,
      payment_screenshot_base64: base64Screenshot,
      email: 'glossology001@gmail.com',  // Send to business owner
      order_details: orderDetailsForOwner
    };

    console.log('Sending customer confirmation email...');
    emailjs.send('service_8962v97', 'template_p0romb1', customerEmailParams)
      .then(response => {
        console.log('✓ Customer confirmation email sent!', response);
        
        // Send invoice email to customer
        sendInvoiceEmail(orderId, name, email, address, city, state, productsList, total, mobileNumber, deliveryTimeframe);
        
        console.log('Sending business owner notification email...');
        emailjs.send('service_8962v97', 'template_1j0y09w', ownerEmailParams)
      })
      .catch(error => {
        console.error('Customer email error:', error);
        console.log('Attempting to send owner notification...');
        emailjs.send('service_8962v97', 'template_1j0y09w', ownerEmailParams)
      });
  };
  
  // Start reading the file as Base64
  reader.readAsDataURL(screenshotFile);
}

// Send Invoice Email
function sendInvoiceEmail(orderId, name, email, address, city, state, products, total, mobileNumber, deliveryTimeframe) {
  console.log('Preparing invoice email for order:', orderId);
  
  // Format invoice details
  const invoiceDate = new Date().toLocaleDateString();
  
  const invoiceEmailParams = {
    order_id: orderId,
    invoice_date: invoiceDate,
    from_name: name,
    customer_email: email,
    mobile_number: mobileNumber,
    address: address,
    city: city,
    state: state,
    country: 'Nigeria',
    products: products,
    product_total: `₦${total.toLocaleString()}`,
    delivery_timeframe: deliveryTimeframe,
    email: email  // Send to customer
  };

  console.log('Sending order confirmation email...');
  emailjs.send('service_8962v97', 'template_invoice', invoiceEmailParams)
    .then(response => {
      console.log('✓ Order confirmation email sent successfully!', response);
    })
    .catch(error => {
      console.error('Order confirmation email error:', error);
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
  
  console.log('Contact form values:', {firstname, lastname, email, phone, inquiryType, message});

  // MINIMAL validation
  if (!firstname || firstname.length < 2) {
    alert('Please enter your first name');
    return;
  }
  
  if (!lastname || lastname.length < 2) {
    alert('Please enter your last name');
    return;
  }
  
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }
  
  if (!phone || phone.length < 10) {
    alert('Please enter a valid phone number');
    return;
  }
  
  if (!inquiryType) {
    alert('Please select an inquiry type');
    return;
  }
  
  if (!message || message.length < 5) {
    alert('Please enter a message (at least 5 characters)');
    return;
  }

  console.log('Contact form validation passed, submitting...');
  const name = `${firstname} ${lastname}`;
  
  const templateParams = {
    order_id: 'CONTACT-' + Date.now(),
    from_name: firstname + ' ' + lastname,
    customer_email: email,
    address: inquiryType,
    city: 'Contact Inquiry',
    state: inquiryType,
    country: 'Nigeria',
    products: message,
    payment_method: phone,
    email: email
  };

  console.log('Sending contact email via EmailJS...');
  emailjs.send('service_8962v97', 'template_p0romb1', templateParams)
    .then(response => {
      console.log('Contact email sent successfully!', response);
      showContactSuccess(firstname, email);
      contactForm.reset();
    })
    .catch(error => {
      console.error('EmailJS error:', error);
      alert('Message received! We\'ll respond shortly.');
      showContactSuccess(firstname, email);
      contactForm.reset();
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
  
  if (!paymentForm) {
    console.error('❌ CRITICAL: paymentForm NOT found! Checkout will not work.');
  } else {
    console.log('✓ paymentForm found');
  }
  
  if (!contactForm) {
    console.warn('⚠ contactForm not found (OK if not on this page)');
  } else {
    console.log('✓ contactForm found');
  }

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
    // Add payment form submit event listener
    if (paymentForm) {
      console.log('✓ Attaching submit listener to paymentForm');
      paymentForm.addEventListener('submit', handlePaymentFormSubmit);
      console.log('✓ Submit listener attached to paymentForm');
      
      // Add state change listener to update delivery timeframe
      const stateSelect = paymentForm.querySelector('select[name="state"]');
      if (stateSelect) {
        stateSelect.addEventListener('change', (e) => {
          const deliveryTimeframeField = document.getElementById('deliveryTimeframe');
          if (deliveryTimeframeField) {
            const selectedState = e.target.value;
            if (selectedState === 'Lagos') {
              deliveryTimeframeField.value = '🚚 Lagos Delivery - 2-3 Working Days';
            } else if (selectedState) {
              deliveryTimeframeField.value = `🚚 Interstate Delivery - 5-7 Working Days (${selectedState})`;
            } else {
              deliveryTimeframeField.value = '';
            }
          }
        });
      }
    }
  
  // Add contact form submit event listener
  if (contactForm) {
    console.log('Attaching submit listener to contactForm');
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
}

function handlePaymentSuccess(paymentForm, name, email, total) {
  // Save to local storage
  const fullAddress = [
    paymentForm.querySelector('textarea[name="address"]')?.value || '',
    paymentForm.querySelector('input[name="city"]')?.value || '',
    paymentForm.querySelector('select[name="state"]')?.value || '',
    paymentForm.querySelector('input[name="country"]')?.value || ''
  ].filter(part => part).join(', ');
  
  const payment = {
    name, email, 
    address: fullAddress,
    paymentMethod: paymentForm.querySelector('textarea[name="paymentNotes"]')?.value || '',
    productReferences: paymentForm.querySelector('textarea[name="productReferences"]')?.value || '',
    total: `₦${total.toFixed(2)}`,
    items: cart,
    timestamp: new Date().toLocaleString()
  };
  
  let payments = JSON.parse(localStorage.getItem('glossologyPayments') || '[]');
  payments.push(payment);
  localStorage.setItem('glossologyPayments', JSON.stringify(payments));

  console.log('Payment saved to local storage');

  // Show success message
  showPaymentSuccess(name, email, total);

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
function showPaymentSuccess(name, email, total) {
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
