'use strict';

const form = document.querySelector('#inquiry-form');
const submitButton = document.querySelector('#submit-inquiry');
const availability = document.querySelector('#availability');
const result = document.querySelector('#form-result');
let acceptingInquiries = false;

document.querySelector('#year').textContent = String(new Date().getFullYear());

function showResult(message, kind) {
  result.textContent = message;
  result.className = `form-result ${kind}`;
  result.focus();
}

async function loadConfig() {
  try {
    const response = await fetch('/api/config', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Configuration unavailable');
    const config = await response.json();
    acceptingInquiries = config.acceptingInquiries === true;
    submitButton.disabled = !acceptingInquiries;
    availability.textContent = acceptingInquiries
      ? 'Project inquiries are open. Send your details to request a scope review.'
      : 'Preview mode: sales contact is not connected, so inquiries cannot be submitted yet. You can explore the complete demo.';
    availability.classList.toggle('is-live', acceptingInquiries);
    if (acceptingInquiries && typeof config.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) {
      const detail = document.querySelector('#contact-detail');
      const label = document.createElement('span');
      label.textContent = 'Prefer email? ';
      const link = document.createElement('a');
      link.textContent = config.contactEmail;
      link.href = `mailto:${encodeURIComponent(config.contactEmail).replace('%40', '@')}`;
      detail.replaceChildren(label, link);
      detail.hidden = false;
    }
  } catch {
    acceptingInquiries = false;
    submitButton.disabled = true;
    availability.textContent = 'Inquiries are currently unavailable. No information has been sent. The demo is still available to explore.';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!acceptingInquiries) {
    showResult('Sales contact is not connected yet. No information was submitted.', 'error');
    return;
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const payload = Object.fromEntries(['name', 'email', 'business', 'website', 'goal', 'website_url'].map((key) => [key, String(data.get(key) || '').trim()]));
  submitButton.disabled = true;
  submitButton.textContent = 'Sending your inquiry…';
  result.textContent = '';
  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 503) {
        acceptingInquiries = false;
        availability.textContent = 'Inquiries are currently unavailable. Please try again when sales contact is connected.';
      }
      throw new Error(typeof body.error === 'string' ? body.error : 'Your inquiry could not be sent. Please try again.');
    }
    form.reset();
    showResult('Your inquiry was received. We’ll review the details and reply by email. This does not confirm a project or take payment.', 'success');
  } catch (error) {
    showResult(error instanceof Error && error.message !== 'Failed to fetch' ? error.message : 'We couldn’t confirm delivery. Please check your connection and try again.', 'error');
  } finally {
    submitButton.disabled = !acceptingInquiries;
    submitButton.replaceChildren(document.createTextNode('Send project inquiry '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    submitButton.append(arrow);
  }
});

loadConfig();
