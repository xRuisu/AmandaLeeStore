/* =====================================
   CONTACT FORM
   Opens the visitor's email application.
===================================== */
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const name = document.getElementById(
        "customer-name"
    ).value.trim();

    const email = document.getElementById(
        "customer-email"
    ).value.trim();

    const phone = document.getElementById(
        "customer-phone"
    ).value.trim();

    const inquiry = document.getElementById(
        "inquiry-type"
    ).value;

    const message = document.getElementById(
        "customer-message"
    ).value.trim();

    const status = document.getElementById(
        "form-status"
    );

    if (!name || !email || !inquiry || !message) {
        status.textContent =
            "Please complete all required fields.";
        return;
    }

    const subject = encodeURIComponent(
        "Amanda Lee Soaps & Bubbles - " + inquiry
    );

    const body = encodeURIComponent(
        "Hello Amanda Lee Soaps & Bubbles!\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + (phone || "Not provided") + "\n" +
        "Inquiry Type: " + inquiry + "\n\n" +
        "Message:\n" + message + "\n\n" +
        "Thank you!"
    );

    const mailtoLink =
        "mailto:amandaleesoaps@gmail.com" +
        "?subject=" + subject +
        "&body=" + body;

    status.textContent =
        "Your email application should open with " +
        "your message prepared. Please review and " +
        "send it to complete your inquiry.";

    window.location.href = mailtoLink;
});
