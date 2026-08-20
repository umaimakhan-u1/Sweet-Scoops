const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", open);
    menuToggle.textContent = open ? "×" : "☰";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector(".cart-panel");
const cartOverlay = document.querySelector(".cart-overlay");
const cartClose = document.querySelector(".cart-close");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");
const checkoutButton = document.querySelector(".checkout-button");

const orderModal = document.querySelector(".order-modal");
const orderClose = document.querySelector(".order-close");
const orderForm = document.querySelector(".order-form");
const orderSummary = document.querySelector(".order-summary");

const cart = [];

function openCart() {
    document.body.classList.add("cart-open");
}

function closeCart() {
    document.body.classList.remove("cart-open");
}

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartCount.textContent = "0";
        cartTotal.textContent = "Rs. 0";
        return;
    }

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        count += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img class="cart-item-image" src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Rs. ${item.price} each</p>

                <div class="quantity-controls">
                    <button data-action="decrease" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button data-action="increase" data-index="${index}">+</button>
                </div>

                <button class="remove-item" data-action="remove" data-index="${index}">
                    Remove
                </button>
            </div>

            <strong class="cart-item-price">
                Rs. ${itemTotal}
            </strong>
        `;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `Rs. ${total}`;
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".flavor-card");

        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const image = card.querySelector("img").getAttribute("src");

        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name,
                price,
                image,
                quantity: 1
            });
        }

        button.textContent = "✓";

        setTimeout(() => {
            button.textContent = "+";
        }, 800);

        renderCart();
        openCart();
    });
});

cartItems.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const index = Number(event.target.dataset.index);

    if (!action || Number.isNaN(index)) {
        return;
    }

    if (action === "increase") {
        cart[index].quantity++;
    }

    if (action === "decrease") {
        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    renderCart();
});

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Please add an ice cream flavor to your cart first.");
        return;
    }

    let summary = "";

    cart.forEach((item) => {
        summary += `${item.name} × ${item.quantity}, `;
    });

    orderSummary.textContent = `Your order: ${summary}`;

    closeCart();
    document.body.classList.add("modal-open");
});

orderClose.addEventListener("click", () => {
    document.body.classList.remove("modal-open");
});

orderModal.addEventListener("click", (event) => {
    if (event.target === orderModal) {
        document.body.classList.remove("modal-open");
    }
});

orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#customer-name").value.trim();
    const phone = document.querySelector("#customer-phone").value.trim();
    const address = document.querySelector("#customer-address").value.trim();

    if (!name || !phone || !address) {
        alert("Please complete all order details.");
        return;
    }

    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
    });

    cart.length = 0;

    renderCart();

    orderForm.reset();

    document.body.classList.remove("modal-open");

    alert(
        `Order Placed Successfully! 🎉\n\n` +
        `Thank you, ${name}!\n` +
        `Your order total is Rs. ${total}.\n\n` +
        `We will contact you at ${phone}.`
    );
});

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    alert(`Thank you, ${name}! Your message has been received.`);

    contactForm.reset();
});

renderCart();