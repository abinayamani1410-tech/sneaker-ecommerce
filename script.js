// PRODUCT DATA
const products = [
  {
    id: 1,
    name: "Air Pulse Red",
    category: "Running",
    price: 4999,
    tag: "BESTSELLER",
    image: "photo-1542291026-7eec264c27ff"
  },
  {
    id: 2,
    name: "Urban Shadow",
    category: "Lifestyle",
    price: 4299,
    tag: "NEW DROP",
    image: "photo-1552346154-21d32810aba3"
  },
  {
    id: 3,
    name: "Cloud Runner",
    category: "Running",
    price: 5499,
    tag: "PERFORMANCE",
    image: "photo-1460353581641-37baddab0fa2"
  },
  {
    id: 4,
    name: "Street Classic",
    category: "Streetwear",
    price: 3799,
    tag: "CLASSIC",
    image: "photo-1525966222134-fcfa99b8ae77"
  },
  {
    id: 5,
    name: "Neon Velocity",
    category: "Running",
    price: 5999,
    tag: "LIMITED",
    image: "photo-1495555961986-6d4c1ecb7be3"
  },
  {
    id: 6,
    name: "Daily Motion",
    category: "Lifestyle",
    price: 3299,
    tag: "EVERYDAY",
    image: "photo-1549298916-b41d501d3772"
  }
];

// HELPER FUNCTIONS
const $ = id => document.getElementById(id);

const imageURL = photo =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=80`;

const formatPrice = price =>
  "₹" + price.toLocaleString("en-IN");

// APP STATE
let selectedCategory = "All";
let cart = [];
let toastTimer;

// ELEMENTS
const productGrid = $("productGrid");
const searchInput = $("searchInput");
const cartDrawer = $("cartDrawer");
const cartOverlay = $("cartOverlay");
const cartItems = $("cartItems");
const heroVisual = $("heroVisual");
const heroShoe = $("heroShoe");

// SAFETY CHECK
if (
  !productGrid ||
  !searchInput ||
  !cartDrawer ||
  !cartOverlay ||
  !cartItems
) {
  console.error(
    "SOLEVERSE: Required HTML elements are missing. Check index.html IDs."
  );
} else {

  // ========================================
  // DISPLAY PRODUCTS
  // ========================================

  function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <p class="no-products">
          No sneakers found. Try another search.
        </p>
      `;
      return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
      <article class="product">

        <div class="product-image">

          <span class="product-tag">
            ${product.tag}
          </span>

          <img
            src="${imageURL(product.image)}"
            alt="${product.name}"
            loading="lazy"
          >

        </div>

        <div class="product-info">

          <div class="product-category">
            ${product.category}
          </div>

          <h3>${product.name}</h3>

          <div class="product-bottom">

            <span class="product-price">
              ${formatPrice(product.price)}
            </span>

            <button
              class="add-button"
              type="button"
              data-add="${product.id}"
            >
              + Add to Bag
            </button>

          </div>

        </div>

      </article>
    `).join("");
  }

  // ========================================
  // SEARCH
  // ========================================

  searchInput.addEventListener("input", renderProducts);

  // ========================================
  // CATEGORY FILTERS
  // ========================================

  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {

      selectedCategory = button.dataset.category;

      document.querySelectorAll(".filter-button").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      renderProducts();
    });
  });

  // ========================================
  // TOAST NOTIFICATION
  // ========================================

  function showToast(message) {
    const toast = $("toast");

    if (!toast) {
      console.log(message);
      return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2300);
  }

  // ========================================
  // ADD TO CART
  // ========================================

  productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const productId = Number(button.dataset.add);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        id: productId,
        quantity: 1
      });
    }

    renderCart();
    showToast("Sneaker added to your bag!");
  });

  // ========================================
  // RENDER CART
  // ========================================

  function renderCart() {
    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + product.price * item.quantity;
    }, 0);

    if ($("cartCount")) {
      $("cartCount").textContent = totalQuantity;
    }

    if ($("drawerCount")) {
      $("drawerCount").textContent = `(${totalQuantity})`;
    }

    if ($("cartTotal")) {
      $("cartTotal").textContent = formatPrice(totalPrice);
    }

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <p class="empty-cart">
          Your bag is empty.
          <br>
          Discover your favourite sneakers!
        </p>
      `;
      return;
    }

    cartItems.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);

      return `
        <div class="cart-item">

          <img
            src="${imageURL(product.image)}"
            alt="${product.name}"
          >

          <div>

            <h3>${product.name}</h3>

            <p>${formatPrice(product.price)}</p>

            <div class="cart-item-controls">

              <button
                class="quantity-button"
                type="button"
                data-minus="${product.id}"
                aria-label="Decrease quantity"
              >−</button>

              <span>${item.quantity}</span>

              <button
                class="quantity-button"
                type="button"
                data-plus="${product.id}"
                aria-label="Increase quantity"
              >+</button>

              <button
                class="remove-button"
                type="button"
                data-remove="${product.id}"
              >Remove</button>

            </div>

          </div>

        </div>
      `;
    }).join("");
  }

  // ========================================
  // CHANGE QUANTITY / REMOVE PRODUCT
  // ========================================

  cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(
      button.dataset.plus ??
      button.dataset.minus ??
      button.dataset.remove
    );

    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (button.hasAttribute("data-plus")) {
      item.quantity++;
    } else if (button.hasAttribute("data-minus")) {
      item.quantity--;

      if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
      }
    } else if (button.hasAttribute("data-remove")) {
      cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
  });

  // ========================================
  // OPEN AND CLOSE CART
  // ========================================

  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.classList.add("cart-open");

    cartDrawer.removeAttribute("inert");
    cartDrawer.setAttribute("aria-hidden", "false");

    if ($("openCart")) {
      $("openCart").setAttribute("aria-expanded", "true");
    }

    if ($("closeCart")) {
      $("closeCart").focus();
    }
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.classList.remove("cart-open");

    cartDrawer.setAttribute("inert", "");
    cartDrawer.setAttribute("aria-hidden", "true");

    if ($("openCart")) {
      $("openCart").setAttribute("aria-expanded", "false");
      $("openCart").focus();
    }
  }

  if ($("openCart")) {
    $("openCart").addEventListener("click", openCart);
    $("openCart").setAttribute("aria-expanded", "false");
  }

  if ($("closeCart")) {
    $("closeCart").addEventListener("click", closeCart);
  }

  cartOverlay.addEventListener("click", closeCart);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
      closeCart();
    }
  });

  // ========================================
  // CHECKOUT DEMO
  // ========================================

  if ($("checkoutButton")) {
    $("checkoutButton").addEventListener("click", () => {

      if (cart.length === 0) {
        showToast("Your bag is empty!");
        return;
      }

      showToast(
        "Demo checkout only. Payment is not connected yet."
      );
    });
  }

  // ========================================
  // 3D HERO SHOE INTERACTION
  // ========================================

  if (heroVisual && heroShoe) {

    const canTilt = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (canTilt) {

      heroVisual.addEventListener("pointermove", event => {

        const rect = heroVisual.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroShoe.style.animation = "none";

        heroShoe.style.transform = `
          rotateY(${x * 22}deg)
          rotateX(${-y * 15}deg)
          rotate(-12deg)
        `;
      });

      heroVisual.addEventListener("pointerleave", () => {
        heroShoe.style.transform = "";
        heroShoe.style.animation = "";
      });
    }
  }

  // ========================================
  // INITIALIZE WEBSITE
  // ========================================

  renderProducts();
  renderCart();

  console.log("SOLEVERSE website initialized successfully!");
}