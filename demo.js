'use strict';

const form = document.querySelector('#estimate-form');
const priceOutput = document.querySelector('#quote-price');
const preview = document.querySelector('#booking-preview');
const summary = document.querySelector('#booking-summary');
const packages = {
  refresh: { name: 'The Refresh', price: 99 },
  full: { name: 'The Full Detail', price: 189 },
  signature: { name: 'The Signature', price: 289 },
};
const vehicles = {
  sedan: { name: 'sedan / coupe', extra: 0 },
  suv: { name: 'SUV / crossover', extra: 30 },
  large: { name: 'large SUV / truck / van', extra: 50 },
};
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function getSelection() {
  const data = new FormData(form);
  const selectedPackage = packages[data.get('package')] || packages.full;
  const vehicle = vehicles[data.get('vehicle')] || vehicles.sedan;
  const petHair = data.get('pet') === 'yes';
  const total = selectedPackage.price + vehicle.extra + (petHair ? 40 : 0);
  return { selectedPackage, vehicle, petHair, total };
}

function updateEstimate() {
  priceOutput.textContent = money.format(getSelection().total);
  preview.hidden = true;
}

form.addEventListener('change', updateEstimate);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { selectedPackage, vehicle, petHair, total } = getSelection();
  summary.textContent = `${selectedPackage.name} for a ${vehicle.name}${petHair ? ', with pet hair removal' : ''}. Illustrative starting price: ${money.format(total)} USD.`;
  preview.hidden = false;
  preview.focus();
});

document.querySelectorAll('[data-package]').forEach((link) => {
  link.addEventListener('click', () => {
    const value = link.dataset.package;
    for (const input of form.querySelectorAll('input[name="package"]')) {
      input.checked = input.value === value;
    }
    updateEstimate();
  });
});

document.querySelector('#close-preview').addEventListener('click', () => {
  preview.hidden = true;
  form.querySelector('button[type="submit"]').focus();
});

updateEstimate();

// Enable submission only after the local-only handler is registered.
form.querySelector('button[type="submit"]').disabled = false;
