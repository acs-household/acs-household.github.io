// ACS Household contact form. The default mode prepares a draft email.
// To enable direct submissions, create a Formspree form, verify its recipient
// in Formspree, and add its HTTPS endpoint to data-formspree-endpoint in index.html.
// Never put passwords or account tokens in this public file.
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('form-submit');
const submitLabel = document.getElementById('submit-label');
const formNote = document.getElementById('form-note');
const privacyNote = document.getElementById('privacy-note');

if (contactForm) {
  const endpoint = (contactForm.dataset.formspreeEndpoint || '').trim();
  const directMode = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint);
  const emailDestination = contactForm.dataset.contactEmail || 'acshousemanagement@gmail.com';

  if (directMode) {
    submitLabel.textContent = 'Send enquiry';
    formNote.textContent = 'Your enquiry will be submitted securely using our contact form provider.';
    privacyNote.textContent = 'Your details will be used to respond to your enquiry and processed by the contact form provider. Please avoid sending sensitive information in this initial message.';
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const location = String(data.get('location') || '').trim();
    const supportType = String(data.get('support_type') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) return;

    formStatus.hidden = false;
    if (!directMode) {
      const subject = encodeURIComponent('ACS Household — private household enquiry');
      const body = encodeURIComponent([
        'Hello Csilla,', '', message, '',
        supportType ? `Support requested: ${supportType}` : '',
        location ? `Location: ${location}` : '', '',
        'Kind regards,', name, email
      ].filter((line, i, arr) => line !== '' || arr[i - 1] !== '').join('\n'));
      formStatus.textContent = 'An email draft should open in your email app. Please press Send there. If no app opens, use the email address below.';
      window.location.href = `mailto:${emailDestination}?subject=${subject}&body=${body}`;
      return;
    }

    // Direct submission is only used once a valid Formspree endpoint is set.
    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';
    formStatus.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);
      contactForm.reset();
      formStatus.textContent = 'Thank you — your enquiry was submitted. I look forward to reading it.';
    } catch (error) {
      formStatus.textContent = 'Your enquiry could not be sent. Please try again or use the email address below.';
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send enquiry';
    }
  });
}
