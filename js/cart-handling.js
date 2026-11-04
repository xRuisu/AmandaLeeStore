
/* =====================================
   CART CONFIGURATION
   Must match products.html
===================================== */

const CART_KEY = "amanda-lee-cart-v1";

const PRODUCTS = {
    "cashmere-sweater": {
        name: "Cashmere Sweater",
        price: 7,
        category: "regular",
        image: "images/cashmere-sweater.png"
    },
    "baby-powder": {
        name: "Baby Powder",
        price: 10,
        category: "kids",
        image: null
    },
    "bubblegum": {
        name: "Bubblegum",
        price: 10,
        category: "kids",
        image: null
    }
};

/* =====================================
   STORAGE HELPERS
===================================== */

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart.filter(item =>
            item &&
            PRODUCTS[item.id] &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99 &&
            typeof item.customization === "string"
        );
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    renderCart();
}

function money(amount) {
    return "$" + amount.toFixed(2);
}

/* =====================================
   CART TOTALS
===================================== */

function calculateTotals(cart) {
    let subtotal = 0;
    let itemCount = 0;
    let regularCount = 0;

    for (const item of cart) {
        const product = PRODUCTS[item.id];

        subtotal += product.price * item.quantity;
        itemCount += item.quantity;

        if (product.category === "regular") {
            regularCount += item.quantity;
        }
    }

    /*
       Regular soaps cost $7 each.
       Four normally cost $28.
       Bundle price is $25.
       Discount = $3 for each complete group of four.
    */

    const completeBundles = Math.floor(
        regularCount / 4
    );

    const bundleDiscount = completeBundles * 3;

    return {
        subtotal,
        itemCount,
        regularCount,
        completeBundles,
        bundleDiscount,
        soapTotal: subtotal - bundleDiscount
    };
}

/* =====================================
   BUILD CART ITEMS
===================================== */

function createCartItem(item, index) {
    const product = PRODUCTS[item.id];

    const article = document.createElement("article");
    article.className = "cart-item";

    if (product.image) {
        const image = document.createElement("img");

        image.className = "item-image";
        image.src = product.image;
        image.alt = product.name + " handmade soap";

        article.appendChild(image);
    } else {
        const placeholder = document.createElement("div");

        placeholder.className = "item-placeholder";
        placeholder.textContent = "🫧";
        placeholder.setAttribute("aria-hidden", "true");

        article.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "item-info";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const category = document.createElement("p");
    category.className = "item-category";
    category.textContent =
        product.category === "regular"
            ? "Regular Handmade Soap"
            : "Kids' Handmade Soap";

    const price = document.createElement("p");
    price.textContent = money(product.price) + " per bar";

    info.append(title, category, price);

    if (item.customization) {
        const note = document.createElement("div");
        note.className = "customization-note";

        const label = document.createElement("strong");
        label.textContent = "Ingredient substitution request:";

        const description = document.createElement("p");
        description.textContent = item.customization;

        const pending = document.createElement("p");
        pending.textContent =
            "Subject to review and approval.";

        note.append(label, description, pending);
        info.appendChild(note);
    }

    const controls = document.createElement("div");
    controls.className = "item-controls";

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute(
        "aria-label",
        "Decrease quantity of " + product.name
    );

    minus.addEventListener("click", () => {
        changeQuantity(index, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute(
        "aria-label",
        "Increase quantity of " + product.name
    );

    plus.addEventListener("click", () => {
        changeQuantity(index, 1);
    });

    quantityControls.append(minus, quantity, plus);

    const lineTotal = document.createElement("span");
    lineTotal.className = "line-total";
    lineTotal.textContent = money(
        product.price * item.quantity
    );

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";

    remove.addEventListener("click", () => {
        removeItem(index);
    });

    controls.append(
        quantityControls,
        lineTotal,
        remove
    );

    info.appendChild(controls);
    article.appendChild(info);

    return article;
}

/* =====================================
   QUANTITY CONTROLS
===================================== */

function changeQuantity(index, difference) {
    const cart = getCart();

    if (!cart[index]) return;

    const newQuantity =
        cart[index].quantity + difference;

    if (newQuantity <= 0) {
        cart.splice(index, 1);
    } else if (newQuantity <= 99) {
        cart[index].quantity = newQuantity;
    }

    saveCart(cart);
}

function removeItem(index) {
    const cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart(cart);
}

/* =====================================
   RENDER CART
===================================== */

function renderCart() {
    const cart = getCart();
    const totals = calculateTotals(cart);

    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");

    cartItems.replaceChildren();

    emptyCart.hidden = cart.length > 0;

    cart.forEach((item, index) => {
        cartItems.appendChild(
            createCartItem(item, index)
        );
    });

    document.getElementById("cart-count").textContent =
        totals.itemCount > 0
            ? `(${totals.itemCount})`
            : "";

    document.getElementById("item-count").textContent =
        totals.itemCount;

    document.getElementById("subtotal").textContent =
        money(totals.subtotal);

    document.getElementById("bundle-discount").textContent =
        "-" + money(totals.bundleDiscount);

    document.getElementById("soap-total").textContent =
        money(totals.soapTotal);

    document.getElementById("shipping-cost").textContent =
        "Pending";
}

/* =====================================
   SHIPPING QUOTE STATUS
===================================== */

document.getElementById("shipping-button")
    .addEventListener("click", () => {
        const zip = document
            .getElementById("shipping-zip")
            .value.trim();

        const message = document.getElementById(
            "shipping-message"
        );

        if (!/^\d{5}$/.test(zip)) {
            message.textContent =
                "Please enter a valid 5-digit US ZIP code.";
            return;
        }

        if (getCart().length === 0) {
            message.textContent =
                "Add soap to your cart before requesting a shipping quote.";
            return;
        }

        message.textContent =
            "Destination ZIP " + zip +
            " saved for this quote request. " +
            "A live shipping rate is not available yet. " +
            "Accurate shipping requires product weights, " +
            "packed box dimensions, and a connected carrier " +
            "rate service. No shipping price has been charged " +
            "or calculated.";
    });

renderCart();