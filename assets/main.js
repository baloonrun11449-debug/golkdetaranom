/**
 * گلکده ترنم - مرجع رسمی تاج گل طبیعی تهران و کرج
 * Standalone Vanilla JavaScript for GitHub Pages Deployment
 * No build tools required - Zero dependency
 */

// Initialize Cart State from LocalStorage
let cart = [];
try {
  const savedCart = localStorage.getItem('taranom_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  cart = [];
}

// Telegram Official Bot / Account
const TELEGRAM_HANDLE = 'TaranomFlower'; // https://t.me/TaranomFlower
const WHATSAPP_PHONE = '989123456789';
const DIRECT_PHONE = '02188990011';

// Save Cart and update UI
function saveCart() {
  try {
    localStorage.setItem('taranom_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartBadge();
  renderCartDrawer();
}

// Update Cart Badge in Header
function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

// Format Numbers to Persian with Commas
function formatPersianPrice(amount) {
  if (isNaN(amount)) return '۰';
  const formatted = amount.toLocaleString('fa-IR');
  return formatted;
}

// Toast Notification
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0 ${
    type === 'success' ? 'bg-[#5c5080] text-white' : 'bg-red-700 text-white'
  }`;

  const iconName = type === 'success' ? 'check_circle' : 'info';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${iconName}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Add Item to Cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      sku: product.sku || '',
      image: product.image,
      ribbonText: product.ribbonText || 'عرض تسلیت / تبریک',
      quantity: 1
    });
  }
  saveCart();
  showToast(`«${product.title}» به سبد خرید اضافه شد.`);
  openCartDrawer();
}

// Remove Item from Cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

// Update Item Quantity
function updateCartQuantity(id, delta) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }
}

// Open/Close Cart Drawer
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      drawer.classList.remove('translate-x-full');
    });
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }
}

// Render Cart Drawer Contents
function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  const totalEl = document.getElementById('cart-total-price');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <span class="material-symbols-outlined text-[64px] text-gray-300 mb-4">shopping_bag</span>
        <p class="font-bold text-lg text-gray-700 mb-1">سبد خرید شما خالی است</p>
        <p class="text-sm text-gray-400 mb-6">هیچ تاج گلی هنوز انتخاب نکرده‌اید.</p>
        <a href="products.html" class="px-6 py-2.5 rounded-full bg-[#5c5080] text-white text-sm font-semibold hover:bg-[#75689a] transition-all">
          مشاهده کاتالوگ تاج گل‌ها
        </a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '۰ تومان';
    if (totalEl) totalEl.textContent = '۰ تومان';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.price * item.quantity;
    return `
      <div class="flex gap-4 p-4 rounded-2xl bg-white border border-[#E8E6E2] shadow-sm">
        <img src="${item.image}" alt="${item.title}" class="w-20 h-24 object-cover rounded-xl bg-gray-50 flex-shrink-0" />
        <div class="flex flex-col flex-1 justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-sm text-[#30313A] line-clamp-1">${item.title}</h4>
              <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="حذف">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
            ${item.sku ? `<span class="text-xs text-gray-400">کد: ${item.sku}</span>` : ''}
          </div>
          <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <span class="font-bold text-sm text-[#5c5080]">${formatPersianPrice(item.price)} تومان</span>
            <div class="flex items-center gap-2 bg-[#f4f3f0] px-2 py-1 rounded-lg">
              <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black">
                <span class="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
              <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black">
                <span class="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `${formatPersianPrice(subtotal)} تومان`;
  if (totalEl) totalEl.textContent = `${formatPersianPrice(subtotal)} تومان`;
}

// Telegram Checkout Function
function checkoutViaTelegram() {
  if (cart.length === 0) {
    showToast('سبد خرید شما خالی است!', 'error');
    return;
  }

  let total = 0;
  let itemsList = '';
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemsList += `${index + 1}. *${item.title}* (کد: ${item.sku || '---'})\n   تعداد: ${item.quantity} عدد | مبلغ: ${itemTotal.toLocaleString('fa-IR')} تومان\n`;
  });

  const message = `🌸 *سفارش جدید تاج گل طبیعی - گلکده ترنم* 🌸\n\n` +
    `اقلام انتخابی:\n${itemsList}\n` +
    `💰 *مجموع کل:* ${total.toLocaleString('fa-IR')} تومان\n\n` +
    `🚚 *خدمات درخواستی:* ارسال با خودرو مسقف + چاپ روبان تسلیت/تبریک رایگان\n` +
    `لطفاً جهت ثبت زمان تحویل و آدرس مقصد هماهنگی بفرمایید.`;

  const encodedMessage = encodeURIComponent(message);
  const telegramUrl = `https://t.me/${TELEGRAM_HANDLE}?text=${encodedMessage}`;
  window.open(telegramUrl, '_blank');
}

// Quick Order Modal Logic with Live Ribbon Preview
let activeQuickProduct = null;

function openQuickOrderModal(product) {
  activeQuickProduct = product;
  const modal = document.getElementById('quick-order-modal');
  if (!modal) return;

  // Fill modal elements
  document.getElementById('modal-product-title').textContent = product.title;
  document.getElementById('modal-product-sku').textContent = product.sku || 'TRN-VIP';
  document.getElementById('modal-product-price').textContent = `${formatPersianPrice(product.price)} تومان`;
  document.getElementById('modal-product-img').src = product.image;
  
  // Set default live ribbon preview
  updateRibbonPreview();

  modal.classList.remove('hidden');
}

function closeQuickOrderModal() {
  const modal = document.getElementById('quick-order-modal');
  if (modal) modal.classList.add('hidden');
}

function updateRibbonPreview() {
  const senderInput = document.getElementById('ribbon-sender-input');
  const recipientInput = document.getElementById('ribbon-recipient-input');
  const messageInput = document.getElementById('ribbon-message-input');
  
  const ribbonTextEl = document.getElementById('live-ribbon-text');
  const ribbonSenderEl = document.getElementById('live-ribbon-sender');

  const sender = senderInput && senderInput.value.trim() ? senderInput.value.trim() : 'خانواده محترم داغدار / شرکت شما';
  const recipient = recipientInput && recipientInput.value.trim() ? recipientInput.value.trim() : 'مجلس یادبود و گرامی‌داشت';
  const customMessage = messageInput && messageInput.value.trim() ? messageInput.value.trim() : 'عرض تسلیت صمیمانه و آرزوی شکیبایی';

  if (ribbonTextEl) ribbonTextEl.textContent = `${customMessage} - به یاد ${recipient}`;
  if (ribbonSenderEl) ribbonSenderEl.textContent = `از طرف: ${sender}`;
}

function submitQuickTelegramOrder() {
  if (!activeQuickProduct) return;

  const sender = (document.getElementById('ribbon-sender-input')?.value || 'نامشخص').trim();
  const recipient = (document.getElementById('ribbon-recipient-input')?.value || 'نامشخص').trim();
  const message = (document.getElementById('ribbon-message-input')?.value || 'عرض تسلیت / تبریک').trim();
  const destination = (document.getElementById('order-destination-input')?.value || 'تهران / کرج').trim();
  const phone = (document.getElementById('order-phone-input')?.value || 'تماس تلفنی').trim();

  const telegramText = `🌿 *ثبت سفارش اختصاصی تاج گل ترنم* 🌿\n\n` +
    `🌺 *محصول:* ${activeQuickProduct.title}\n` +
    `🔖 *کد محصول:* ${activeQuickProduct.sku}\n` +
    `💵 *قیمت:* ${activeQuickProduct.price.toLocaleString('fa-IR')} تومان\n\n` +
    `🎀 *مشخصات چاپ روی روبان تشریفاتی:*\n` +
    `• از طرف: ${sender}\n` +
    `• جهت تقدیم به: ${recipient}\n` +
    `• متن روبان: «${message}»\n\n` +
    `📍 *محل و زمان تحویل:*\n` +
    `• آدرس / نام تالار یا مسجد: ${destination}\n` +
    `• شماره تماس هماهنگی: ${phone}\n\n` +
    `لطفاً عکس نهایی قبل از ارسال و زمان تحویل را تایید بفرمایید.`;

  const url = `https://t.me/${TELEGRAM_HANDLE}?text=${encodeURIComponent(telegramText)}`;
  window.open(url, '_blank');
  closeQuickOrderModal();
  showToast('سفارش شما در تلگرام باز شد. همکاران ما آماده پاسخگویی هستند.');
}

// DOM Content Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  // Update Cart Badge
  updateCartBadge();
  renderCartDrawer();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Cart Drawer Trigger
  const cartButtons = document.querySelectorAll('.cart-trigger-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }

  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  // Telegram Checkout Button in Drawer
  const telegramCheckoutBtn = document.getElementById('telegram-checkout-btn');
  if (telegramCheckoutBtn) {
    telegramCheckoutBtn.addEventListener('click', checkoutViaTelegram);
  }

  // Live Ribbon Preview Listeners
  ['ribbon-sender-input', 'ribbon-recipient-input', 'ribbon-message-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateRibbonPreview);
    }
  });

  // Modal Close buttons
  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeQuickOrderModal);
  }

  const submitModalOrderBtn = document.getElementById('submit-modal-order-btn');
  if (submitModalOrderBtn) {
    submitModalOrderBtn.addEventListener('click', submitQuickTelegramOrder);
  }

  // Tier Filter Logic for Condolence
  const tierBtns = document.querySelectorAll('.tier-btn');
  const condolenceCards = document.querySelectorAll('.condolence-card');
  if (tierBtns.length > 0 && condolenceCards.length > 0) {
    tierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tierBtns.forEach(b => {
          b.classList.remove('bg-[#5c5080]', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-gray-700');
        });
        btn.classList.add('bg-[#5c5080]', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-gray-700');

        const tier = btn.getAttribute('data-tier');
        condolenceCards.forEach(card => {
          if (tier === 'all' || card.getAttribute('data-tier') === tier) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // FAQ Accordion
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.material-symbols-outlined');
      const isHidden = content.classList.contains('hidden');

      // Close other accordions
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle .material-symbols-outlined').forEach(i => i.classList.remove('rotate-180'));

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // Product Showroom Filtering & Search (on products.html)
  const categoryTabs = document.querySelectorAll('.catalog-tab-btn');
  const catalogProducts = document.querySelectorAll('.catalog-product-item');
  const searchInput = document.getElementById('product-search-input');
  const sortSelect = document.getElementById('product-sort-select');

  function filterCatalog() {
    const activeTab = document.querySelector('.catalog-tab-btn.active')?.getAttribute('data-category') || 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    catalogProducts.forEach(item => {
      const itemCat = item.getAttribute('data-category') || '';
      const title = (item.getAttribute('data-title') || '').toLowerCase();
      const flowers = (item.getAttribute('data-flowers') || '').toLowerCase();
      const sku = (item.getAttribute('data-sku') || '').toLowerCase();

      const matchesCat = activeTab === 'all' || itemCat.includes(activeTab);
      const matchesSearch = !query || title.includes(query) || flowers.includes(query) || sku.includes(query);

      if (matchesCat && matchesSearch) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (categoryTabs.length > 0) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => {
          t.classList.remove('active', 'bg-[#5c5080]', 'text-white');
          t.classList.add('bg-white', 'text-gray-700');
        });
        tab.classList.add('active', 'bg-[#5c5080]', 'text-white');
        tab.classList.remove('bg-white', 'text-gray-700');
        filterCatalog();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const container = document.getElementById('products-grid-container');
      if (!container) return;
      const items = Array.from(catalogProducts);
      const val = sortSelect.value;

      items.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price') || '0', 10);
        const priceB = parseInt(b.getAttribute('data-price') || '0', 10);
        const heightA = parseFloat(a.getAttribute('data-height') || '0');
        const heightB = parseFloat(b.getAttribute('data-height') || '0');

        if (val === 'price-low') return priceA - priceB;
        if (val === 'price-high') return priceB - priceA;
        if (val === 'height-high') return heightB - heightA;
        return 0;
      });

      items.forEach(node => container.appendChild(node));
    });
  }
});
