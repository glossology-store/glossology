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
  setupEventListeners();
  setupMobileMenu();
  loadCartFromStorage();
  updateCartUI();
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
    cartTotal.textContent = '$0.00';
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
  document.getElementById('paymentRef').textContent = paymentRef;

  // Show order summary in checkout modal
  const orderSummary = document.getElementById('orderSummary');
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
  document.getElementById('checkoutTotal').textContent = `₦${total.toFixed(2)}`;
  
  // Auto-fill product references with real names and quantity in brackets
  const productNames = cart.map(item => `${item.productRef} (${item.name} x${item.quantity})`);
  document.querySelector('textarea[name="productReferences"]').value = productNames.join(', ');

  // Close cart and open checkout
  closeCart();
  document.getElementById('checkoutModal').style.display = 'block';
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
function setupEventListeners() {
  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const checkoutModal = document.getElementById('checkoutModal');
  const paymentForm = document.getElementById('paymentForm');
  const contactForm = document.getElementById('contactForm');
  const fileInput = document.querySelector('input[name="paymentScreenshot"]');

  cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
  });

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
    if (event.target === cartModal) {
      cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
      checkoutModal.style.display = 'none';
    }
  });

  // Handle payment form submission
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default form submission
      
      // Get values ONLY from the payment form (not contact form)
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const paymentRef = document.getElementById('paymentRef').textContent;

      const name = paymentForm.querySelector('input[name="name"]').value.trim();
      const email = paymentForm.querySelector('input[name="email"]').value.trim();
      const address = paymentForm.querySelector('textarea[name="address"]').value.trim();
      const paymentMethod = paymentForm.querySelector('textarea[name="paymentNotes"]').value.trim();
      const fileInput = paymentForm.querySelector('input[name="paymentScreenshot"]');
      
      // Check if required fields are filled
      if (!name) {
        alert('Please enter your full name');
        return;
      }
      if (!email) {
        alert('Please enter your email address');
        return;
      }
      if (!address) {
        alert('Please enter your delivery address');
        return;
      }
      if (!paymentMethod) {
        alert('Please enter payment method details');
        return;
      }
      if (!fileInput.files.length) {
        alert('Please upload a payment screenshot');
        return;
      }

      // Create FormData with file
      const formData = new FormData(paymentForm);
      
      // Submit to FormSubmit via fetch
      fetch('https://formsubmit.co/glossology001@gmail.com', {
        method: 'POST',
        body: formData
      }).then(response => {
        // Save to local storage
        const payment = {
          name, email, address, paymentMethod,
          productReferences: paymentForm.querySelector('textarea[name="productReferences"]').value,
          total: `₦${total.toFixed(2)}`,
          reference: paymentRef,
          items: cart,
          timestamp: new Date().toLocaleString()
        };
        
        let payments = JSON.parse(localStorage.getItem('glossologyPayments') || '[]');
        payments.push(payment);
        localStorage.setItem('glossologyPayments', JSON.stringify(payments));

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
      }).catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector('input[name="name"]').value;
      const email = contactForm.querySelector('input[name="email"]').value;
      
      const formData = new FormData(contactForm);
      
      fetch('https://formsubmit.co/glossology001@gmail.com', {
        method: 'POST',
        body: formData
      }).then(response => {
        showContactSuccess(name, email);
        contactForm.reset();
      }).catch(error => {
        console.error('Error:', error);
        alert('Error sending message. Please try again.');
      });
    });
  }
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
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="this.closest('.modal').remove()">Close</button>
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
