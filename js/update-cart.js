const CART_KEY = "amanda-lee-cart-v1";

        function updateCartCount() {
            const badge =
                document.getElementById("cart-count");

            if (!badge) return;

            let count = 0;

            try {
                const cart = JSON.parse(
                    localStorage.getItem(CART_KEY) || "[]"
                );

                if (Array.isArray(cart)) {
                    count = cart.reduce((sum, item) => {
                        const quantity = Number(item.quantity);

                        return sum + (
                            Number.isInteger(quantity) && quantity > 0
                                ? quantity
                                : 0
                        );
                    }, 0);
                }
            } catch {
                count = 0;
            }

            badge.textContent =
                count > 0 ? `(${count})` : "";
        }

        updateCartCount();

        window.addEventListener(
            "storage",
            updateCartCount
        );