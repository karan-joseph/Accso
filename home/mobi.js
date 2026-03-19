
// selecting side_navbar
var sidenavbar = document.querySelector(".side_navbar");

function shownavbar() {
    sidenavbar.style.left = "0";
}

function closenavbar() {
    sidenavbar.style.left = "-50%";
}

// -----------------------------
// Cart (localStorage + drawer)
// -----------------------------
const CART_STORAGE_KEY = "mobi_cart_v1";
const MODEL_STORAGE_KEY = "mobi_model_v1";

function getCartEls() {
  return {
    overlay: document.getElementById("cartOverlay"),
    drawer: document.getElementById("cartDrawer"),
    items: document.getElementById("cartItems"),
    count: document.getElementById("cartCount"),
    subtitle: document.getElementById("cartSubtitle"),
    subtotal: document.getElementById("cartSubtotal"),
    total: document.getElementById("cartTotal"),
  };
}

function safeParseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return fallback;
  }
}

function loadCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  const parsed = safeParseJSON(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatINR(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toFixed(0)}`;
}

function cartItemCount(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
}

function openCart() {
  const { overlay, drawer } = getCartEls();
  overlay?.classList.add("is-open");
  drawer?.classList.add("is-open");
  overlay?.setAttribute("aria-hidden", "false");
  drawer?.setAttribute("aria-hidden", "false");
}

function closeCart() {
  const { overlay, drawer } = getCartEls();
  overlay?.classList.remove("is-open");
  drawer?.classList.remove("is-open");
  overlay?.setAttribute("aria-hidden", "true");
  drawer?.setAttribute("aria-hidden", "true");
}

function getCurrentProduct() {
  const img = document.getElementById("mainPhone");
  const priceEl = document.getElementById("productPrice");
  const titleEl = document.querySelector(".product-title");
  const brandEl = document.querySelector(".brand");
  const modelInput = document.getElementById("modelInput");

  const title = (titleEl?.textContent || "Phone Skin").trim();
  const brand = (brandEl?.textContent || "Brand").trim();
  const price = Number(priceEl?.textContent) || 0;
  const image = img?.getAttribute("src") || "";
  const model = (modelInput?.value || "").trim();
}

function addCurrentToCart() {
  const confirmedModel = requireModelOrWarn();
  if (!confirmedModel) return;

  const product = getCurrentProduct();
  if (!product.id) return;

  const cart = loadCart();
  const existing = cart.find((x) => x.id === product.id);
  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  // Clear model input after successful add (as requested)
  const modelInput = document.getElementById("modelInput");
  if (modelInput) {
    modelInput.value = "";
    modelInput.blur();
  }
  renderCart();
  openCart();
}

function updateQty(id, delta) {
  const cart = loadCart();
  const item = cart.find((x) => x.id === id);
  if (!item) return;

  item.qty = (Number(item.qty) || 0) + delta;
  if (item.qty <= 0) {
    const next = cart.filter((x) => x.id !== id);
    saveCart(next);
  } else {
    saveCart(cart);
  }
  renderCart();
}

function removeItem(id) {
  const cart = loadCart().filter((x) => x.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = loadCart();
  const { items, count, subtitle, subtotal, total } = getCartEls();
  const itemCount = cartItemCount(cart);
  const sub = cartSubtotal(cart);

  if (count) count.textContent = String(itemCount);
  if (subtitle) subtitle.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  if (subtotal) subtotal.textContent = formatINR(sub);
  if (total) total.textContent = formatINR(sub);

  if (!items) return;
  if (cart.length === 0) {
    items.innerHTML = `
      <div class="cart-empty">
        <p class="cart-empty-title">Your cart is empty</p>
        <p class="cart-empty-subtitle">Add a skin design to get started.</p>
        <button class="secondary-btn" type="button" onclick="closeCart()">Continue shopping</button>
      </div>
    `;
    return;
  }

  items.innerHTML = cart
    .map((item) => {
      const line = (Number(item.price) || 0) * (Number(item.qty) || 0);
      return `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <div class="cart-item-top">
              <div>
                <p class="cart-item-title">${item.title}</p>
                <p class="cart-item-meta">${item.brand}${item.model ? ` • ${item.model}` : ""}</p>
              </div>
              <button class="icon-btn danger" type="button" aria-label="Remove item" onclick="removeItem('${item.id.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-control" role="group" aria-label="Quantity controls">
                <button type="button" onclick="updateQty('${item.id.replace(/'/g, "\\'")}', -1)" aria-label="Decrease quantity">−</button>
                <span>${Number(item.qty) || 0}</span>
                <button type="button" onclick="updateQty('${item.id.replace(/'/g, "\\'")}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <div class="cart-item-price">
                <span class="muted">${formatINR(item.price)} each</span>
                <span class="strong">${formatINR(line)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function buyNow() {
  addCurrentToCart();
}

function checkout() {
  const cart = loadCart();
  if (!cart.length) {
    alert("Your cart is empty. Please add at least one item before checkout.");
    return;
  }
  window.location.href = "checkout.html";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

document.addEventListener("DOMContentLoaded", () => {

  const modelInput = document.getElementById("modelInput");

  // clear saved model
  localStorage.removeItem(MODEL_STORAGE_KEY);

  if(modelInput){
    modelInput.value = "";
  }

  renderCart();
});
