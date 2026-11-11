// The prototype is entirely static. This form prepares an email in the
// visitor's own email application; it does not transmit data to a server.
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const name = contactForm.elements.namedItem('name').value.trim();
  const email = contactForm.elements.namedItem('email').value.trim();
  const message = contactForm.elements.namedItem('message').value.trim();
  if (!name || !email || !message) return;

  const subject = encodeURIComponent('Private household position enquiry');
  const body = encodeURIComponent(
    `Hello Csilla,\n\n${message}\n\nKind regards,\n${name}\n${email}`
  );

  const status = document.getElementById('form-status');
  status.hidden = false;
  status.textContent = 'Your email draft is ready. Please send it from your email app. If no app opens, use the email address below.';
  window.location.href = `mailto:acshousemanagement@gmail.com?subject=${subject}&body=${body}`;
});
