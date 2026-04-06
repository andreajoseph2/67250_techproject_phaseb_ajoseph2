const TICKET_PRICES = {
    "Adult": 18,
    "Student": 10,
    "Member": 15
};

function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function displayGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    if (hour < 12) el.textContent = 'Good Morning! Welcome to MonoMuse.';
    else if (hour < 18) el.textContent = 'Good Afternoon! Welcome to MonoMuse.';
    else el.textContent = 'Good Evening! Welcome to MonoMuse.';
}

function activeNav() {
    const navLinks = document.querySelectorAll('.nav_bar a');
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath ||
            (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navUl = document.querySelector('.nav_bar ul');
    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => navUl.classList.toggle('responsive'));
    }
}

function setupReadMoreButtons() {
    document.querySelectorAll('.readMoreBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-target');
            document.getElementById(id).style.display = 'block';
            btn.style.display = 'none';
            const less = document.querySelector(`.readLessBtn[data-target="${id}"]`);
            if (less) less.style.display = 'inline-block';
        });
    });
    document.querySelectorAll('.readLessBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-target');
            document.getElementById(id).style.display = 'none';
            btn.style.display = 'none';
            const more = document.querySelector(`.readMoreBtn[data-target="${id}"]`);
            if (more) more.style.display = 'inline-block';
        });
    });
}

function setupSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    let current = 0;

    function goTo(n) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
    }

    const prev = document.getElementById('slide-prev');
    const next = document.getElementById('slide-next');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    setInterval(() => goTo(current + 1), 4000);
}

function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;
    const map = L.map('map').setView([40.4444, -79.9606], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '\u00a9 OpenStreetMap contributors'
    }).addTo(map);
    L.marker([40.4444, -79.9606]).addTo(map)
        .bindPopup('<b>MonoMuse Museum</b><br>Pittsburgh, PA 15213')
        .openPopup();
}

function showError(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
}

//BUY TICKETS PAGE
function updateBuyTicketsPrice() {
    const qty = parseInt(document.getElementById('bt-qty').value) || 0;
    const type = document.getElementById('bt-type').value;
    const display = document.getElementById('bt-price-display');
    const summary = document.getElementById('bt-price-summary');

    if (!display || !summary) return;

    if (type && qty > 0) {
        const price = TICKET_PRICES[type] || 0;
        summary.textContent = '$' + (qty * price);
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
}

function setupTicketInteraction() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const formContainer = document.getElementById('purchase-form-container');
    if (!buyButtons.length || !formContainer) return;

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketType = button.getAttribute('data-type');
            const price = TICKET_PRICES[ticketType];

            formContainer.style.display = 'block';
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const label = document.getElementById('selected-ticket-label');
            if (label) {
                label.textContent = `Selected: ${ticketType} — $${price} each`;
            }

            document.getElementById('bt-type').value = ticketType;

            updateBuyTicketsPrice();

            buyButtons.forEach(btn => {
                btn.textContent = 'Buy Now';
                btn.disabled = false;
            });

            button.textContent = 'Selected ✓';
            button.disabled = true;
        });
    });

    document.getElementById('bt-qty')
        ?.addEventListener('input', updateBuyTicketsPrice);

    const form = document.getElementById('ticket-purchase-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('bt-name').value.trim();
        const email = document.getElementById('bt-email').value.trim();
        const qty = parseInt(document.getElementById('bt-qty').value);
        const type = document.getElementById('bt-type').value;
        const date = document.getElementById('bt-date').value;

        if (!name) { showError('bt-name-error', true); valid = false; } else showError('bt-name-error', false);

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRe.test(email)) { showError('bt-email-error', true); valid = false; } else showError('bt-email-error', false);

        if (!qty || qty < 1 || qty > 10) { showError('bt-qty-error', true); valid = false; } else showError('bt-qty-error', false);

        if (!date) { showError('bt-date-error', true); valid = false; } else showError('bt-date-error', false);

        if (!valid) return;

        const price = TICKET_PRICES[type] || 0;

        sessionStorage.setItem('conf-date', date);
        sessionStorage.setItem('conf-type', type);
        sessionStorage.setItem('conf-qty', qty);
        sessionStorage.setItem('conf-email', email);
        sessionStorage.setItem('conf-total', '$' + (qty * price));

        window.location.href = 'confirmation.html';
    });
}

//CHECKOUT PAGE
function updateCheckoutPrice() {
    const qty = parseInt(document.getElementById('quantity').value) || 0;
    const type = document.getElementById('ticket-type').value;

    const display = document.getElementById('price-display');
    const summary = document.getElementById('price-summary');

    if (!display || !summary) return;

    if (type && qty > 0) {
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
        const price = TICKET_PRICES[formattedType] || 0;

        summary.textContent = '$' + (qty * price);
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
}

function setupCheckout() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    document.getElementById('ticket-type')
        ?.addEventListener('change', updateCheckoutPrice);

    document.getElementById('quantity')
        ?.addEventListener('input', updateCheckoutPrice);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const date = document.getElementById('visit-date').value;
        const type = document.getElementById('ticket-type').value;
        const qty = parseInt(document.getElementById('quantity').value);
        const email = document.getElementById('email').value.trim();
        const zip = document.getElementById('zip').value.trim();

        if (!date) { showError('visit-date-error', true); valid = false; } else showError('visit-date-error', false);
        if (!type) { showError('ticket-type-error', true); valid = false; } else showError('ticket-type-error', false);
        if (!qty || qty < 1 || qty > 10) { showError('quantity-error', true); valid = false; } else showError('quantity-error', false);

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRe.test(email)) { showError('email-error', true); valid = false; } else showError('email-error', false);
        if (zip && !/^\d{5}$/.test(zip)) { showError('zip-error', true); valid = false; } else showError('zip-error', false);

        if (!valid) return;

        const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
        const price = TICKET_PRICES[formattedType] || 0;

        sessionStorage.setItem('conf-date', date);
        sessionStorage.setItem('conf-type', formattedType);
        sessionStorage.setItem('conf-qty', qty);
        sessionStorage.setItem('conf-email', email);
        sessionStorage.setItem('conf-total', '$' + (qty * price));

        window.location.href = 'confirmation.html';
    });
}

//CONFIRMATION
function setupConfirmation() {
    if (!document.getElementById('conf-date')) return;

    document.getElementById('conf-date').textContent = sessionStorage.getItem('conf-date') || '—';
    document.getElementById('conf-type').textContent = sessionStorage.getItem('conf-type') || '—';
    document.getElementById('conf-qty').textContent = sessionStorage.getItem('conf-qty') || '—';
    document.getElementById('conf-email').textContent = sessionStorage.getItem('conf-email') || '—';
    document.getElementById('conf-total').textContent = sessionStorage.getItem('conf-total') || '—';
}

$(document).ready(function () {
    $('#readMore').click(function () {
        $('#longIntro').show();
        $('#readMore').hide();
        $('#readLess').show();
    });
    $('#readLess').click(function () {
        $('#longIntro').hide();
        $('#readLess').hide();
        $('#readMore').show();
    });
});

window.addEventListener('DOMContentLoaded', () => {
    updateFooterYear();
    displayGreeting();
    activeNav();
    setupHamburger();
    setupReadMoreButtons();
    setupSlideshow();
    setupTicketInteraction();
    setupCheckout();
    setupConfirmation();
    initMap();
});