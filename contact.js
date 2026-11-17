// ACS Household — contact form for GitHub Pages + Formspree.
// Formspree receives the submissions. The public endpoint is not a secret.
// No passwords or private API keys belong in this file.
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('form-submit');
const submitLabel = document.getElementById('submit-label');

if (contactForm && formStatus && submitButton && submitLabel) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const name = contactForm.elements.namedItem('name')?.value?.trim();
    const email = contactForm.elements.namedItem('email')?.value?.trim();
    const message = contactForm.elements.namedItem('message')?.value?.trim();
    if (!name || !email || !message) {
      formStatus.hidden = false;
      formStatus.textContent = 'Please complete your name, email and message.';
      return;
    }

    const endpoint = contactForm.action;
    if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)) {
      formStatus.hidden = false;
      formStatus.textContent = 'This form is not configured yet. Please use the email address below.';
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';
    formStatus.hidden = false;
    formStatus.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm)
      });
      if (!response.ok) {
        let errorMessage = 'Your enquiry could not be sent. Please try again or use the email address below.';
        // Do not echo server messages into the page: keep user-facing errors clear.
        throw new Error(errorMessage);
      }
      contactForm.reset();
      formStatus.textContent = 'Thank you — your enquiry has been submitted successfully.';
    } catch (error) {
      formStatus.textContent = 'Your enquiry could not be sent. Please try again or email hello@acshousehold.com directly.';
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send enquiry';
    }
  });
}
