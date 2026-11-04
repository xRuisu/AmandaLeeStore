"use strict";

// CART STORAGE
const CART_KEY = "amanda-lee-cart-v1";

// AVAILABLE PRODUCTS
const PRODUCTS = {
    "cashmere-sweater": {
        name: "Cashmere Sweater",
        price: 7,
        category: "regular"
    },

    "baby-powder": {
        name: "Baby Powder",
        price: 10,
        category: "kids"
    },

    "bubblegum": {
        name: "Bubblegum",
        price: 10,
        category: "kids"
    }
};

// READ CART
function readCart() {
    try {
        const result = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        return Array.isArray(result) ? result : [];
    } catch {
        return [];
    }
}

// SAVE CART
function saveCart(cart) {
    try {
        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

        return true;
    } catch {
        return false;
    }
}

// UPDATE BOTH CART COUNTERS
function updateCartCount() {
    const count = readCart().reduce((total, item) => {
        const quantity = Number(item.quantity);

        return total + (
            Number.isInteger(quantity) && quantity > 0
                ? quantity
                : 0
        );
    }, 0);

    document.getElementById("cart-count").textContent =
        "(" + count + ")";

    document.getElementById(
        "floating-cart-count"
    ).textContent = String(count);
}

// ADD SELECTED QUANTITY TO CART
function addToCart(id, customization, quantity) {
    if (
        !PRODUCTS[id] ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
    ) {
        return false;
    }

    const cart = readCart();

    const existing = cart.find(item =>
        item.id === id &&
        (item.customization || "") === customization
    );

    if (existing) {
        const oldQuantity = Number(existing.quantity);

        existing.quantity = (
            Number.isInteger(oldQuantity) &&
            oldQuantity > 0
                ? oldQuantity
                : 0
        ) + quantity;
    } else {
        cart.push({
            id: id,
            quantity: quantity,
            customization: customization
        });
    }

    if (!saveCart(cart)) {
        return false;
    }

    updateCartCount();

    return true;
}

// SOAP ADD TO CART BUTTONS
document.querySelectorAll("[data-add]").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".card");

        const checkbox = card.querySelector(
            ".substitution-checkbox"
        );

        const quantityInput = card.querySelector(
            ".quantity-input"
        );

        const quantity = Number(quantityInput.value);

        const status = card.querySelector(".status");

        // CHECK QUANTITY
        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 99
        ) {
            status.textContent =
                "Please enter a whole-number quantity from 1 to 99.";

            quantityInput.focus();

            return;
        }

        // INGREDIENT SUBSTITUTION REQUEST
        const customization = checkbox.checked
            ? "Customer requests contact about ingredient substitution"
            : "";

        // SAVE TO CART
        const success = addToCart(
            button.dataset.add,
            customization,
            quantity
        );

        if (success) {
            status.textContent =
                "♡ Added " +
                quantity +
                (quantity === 1 ? " bar" : " bars") +
                " to your cart!";

            checkbox.checked = false;
            quantityInput.value = "1";
        } else {
            status.textContent =
                "Unable to save your cart. Please check your browser settings.";
        }

    });

});

// SAMPLE PACK CHECKBOXES
const sampleCheckboxes = Array.from(
    document.querySelectorAll(".sample-checkbox")
);

const sampleCount = document.getElementById(
    "sample-count"
);

const sampleProgress = document.getElementById(
    "sample-progress"
);

const sampleInquiry = document.getElementById(
    "sample-inquiry"
);

const sampleMessage = document.getElementById(
    "sample-message"
);

// GET SELECTED SAMPLES
function selectedSamples() {
    return sampleCheckboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
}

// UPDATE SAMPLE SELECTION
function updateSamples() {
    const selected = selectedSamples();

    // ALLOW UP TO FOUR DIFFERENT SCENTS
    sampleCheckboxes.forEach(checkbox => {
        checkbox.disabled =
            !checkbox.checked && selected.length >= 4;
    });

    // UPDATE COUNTER
    sampleCount.textContent =
        selected.length + " of 4 samples selected";

    // UPDATE PROGRESS BAR
    sampleProgress.style.width =
        (selected.length / 4 * 100) + "%";

    // ENABLE INQUIRY BUTTON
    sampleInquiry.disabled =
        selected.length === 0;

    // DISPLAY STATUS
    sampleMessage.textContent =
        selected.length === 4
            ? "♡ You've selected four different samples!"
            : "";
}

// LISTEN FOR CHECKBOX CHANGES
sampleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener(
        "change",
        updateSamples
    );
});

// SEND SAMPLE PACK INQUIRY
sampleInquiry.addEventListener("click", () => {

    const selected = selectedSamples();

    if (!selected.length) {
        return;
    }

    const subject = "Sample Pack Inquiry";

    const body =
        "Hello Amanda Lee Soaps & Bubbles!\n\n" +
        "I would like to inquire about a sample pack " +
        "with these scents:\n\n" +
        selected.map(
            scent => "- " + scent
        ).join("\n") +
        "\n\nPlease let me know the pricing " +
        "and availability.\n\nThank you!";

    window.location.href =
        "mailto:amandaleesoaps@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

});

// KEEP CART COUNTER UPDATED
window.addEventListener(
    "storage",
    updateCartCount
);

// INITIALIZE PAGE
updateCartCount();
updateSamples();