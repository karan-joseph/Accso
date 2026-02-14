const skins = [
    { id: 'carbon', name: 'Carbon Fiber', price: 999, img: 'assets/skins/carbon.png' },
    { id: 'marble', name: 'White Marble', price: 1299, img: 'assets/skins/marble.png' },
    { id: 'red', name: 'Matte Red', price: 999, img: 'assets/skins/red.png' },
    { id: 'camo', name: 'Urban Camo', price: 1199, img: 'assets/skins/camo.png' }
];

let cart = [];

let selectedSkin = null;

const skinSelector = document.getElementById('skin-selector');
const skinOverlay = document.getElementById('skin-overlay');
const skinLayer = document.getElementById('skin-layer');
const cartCount = document.getElementById('cart-count');
const cartNotification = document.getElementById('cart-notification');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Initialize white base layer to prevent transparency artifacts
function initSkinLayer() {
    if (skinLayer) {
        skinLayer.style.background = '#ffffff';
        skinLayer.style.position = 'absolute';
        skinLayer.style.zIndex = '0';
    }
}

// Initialize
function init() {
    initSkinLayer();
    renderSkins();

    addToCartBtn.addEventListener('click', () => {
        if (selectedSkin) {
            addToCart(selectedSkin);
        }
    });
}

function renderSkins() {
    skinSelector.innerHTML = '';
    skins.forEach(skin => {
        const btn = document.createElement('div');
        btn.classList.add('skin-option');
        btn.style.backgroundImage = `url('${skin.img}')`;
        btn.title = skin.name;

        btn.addEventListener('click', () => {
            // UI Feedback
            document.querySelectorAll('.skin-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Preload and apply preview
            preloadAndApplySkin(skin);
        });

        skinSelector.appendChild(btn);
    });
}

// Preload skin image to ensure seamless application
function preloadAndApplySkin(skin) {
    const img = new Image();
    img.onload = () => {
        applySkinPreview(skin);
    };
    img.onerror = () => {
        console.error(`Failed to load skin image: ${skin.img}`);
        // Still apply, browser will handle missing image
        applySkinPreview(skin);
    };
    img.src = skin.img;
}

function applySkinPreview(skin) {
    selectedSkin = skin;
    
    // Apply skin with strict scaling and positioning
    // Use cover to ensure design fills entire phone without gaps
    skinOverlay.style.backgroundImage = `url('${skin.img}')`;
    skinOverlay.style.backgroundSize = 'cover';
    skinOverlay.style.backgroundPosition = 'center';
    skinOverlay.style.backgroundRepeat = 'no-repeat';
    
    // Ensure no bleeding or artifacts
    skinOverlay.style.transform = 'scale(1)';
    
    // Enable Add to Cart button
    addToCartBtn.disabled = false;
    addToCartBtn.classList.add('active');
    addToCartBtn.innerText = `Add ${skin.name} - $${skin.price}`;
}

function addToCart(skin) {
    // Add item to cart state
    cart.push(skin);

    // Update Count
    cartCount.innerText = cart.length;

    // Show notification
    showNotification(`Added ${skin.name} to cart!`);

    // Animate cart icon
    const cartSummary = document.getElementById('cart-summary');
    cartSummary.style.transform = 'scale(1.1)';
    setTimeout(() => cartSummary.style.transform = 'scale(1)', 200);
}

function showNotification(msg) {
    cartNotification.innerText = msg;
    cartNotification.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
        cartNotification.classList.remove('show');
    }, 2000);
}

init();
