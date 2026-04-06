function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function displayGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let message = "";
        if (hour < 12) {
            message = "Good Morning! Welcome to MonoMuse.";
        } else if (hour < 18) {
            message = "Good Afternoon! Welcome to MonoMuse.";
        } else {
            message = "Good Evening! Welcome to MonoMuse.";
        }
        greetingElement.textContent = message;
    }
}

function activeNav() {
    const navLinks = document.querySelectorAll(".nav_bar a");
    const currentUrl = window.location.href;
    navLinks.forEach(link => {
        if (currentUrl.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function setupTicketInteraction() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const formContainer = document.getElementById('purchase-form-container');
 
    if (buyButtons.length > 0 && formContainer) {
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const ticketType = button.getAttribute('data-type');
                const ticketPrice = button.getAttribute('data-price');
 
                formContainer.style.display = 'block';
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 
                const label = document.getElementById('selected-ticket-label');
                if (label) {
                    label.textContent = `Selected: ${ticketType} ticket — ${ticketPrice} each`;
                }
 
                const typeInput = document.getElementById('t-type');
                if (typeInput) typeInput.value = ticketType;
 
                buyButtons.forEach(btn => {
                    btn.textContent = "Buy Now";
                    btn.disabled = false;
                });
                button.textContent = "Selected ✓";
                button.disabled = true;
            });
        });
    }
 
    const ticketForm = document.getElementById('ticket-purchase-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Redirecting to payment system.");
        });
    }
 
    const checkoutForm = document.querySelector('form[action="#"]');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Redirecting to payment system.");
        });
    }
}

function setupReadMoreButtons() {
    document.querySelectorAll('.readMoreBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
            btn.style.display = 'none';
            const lessBtn = document.querySelector(`.readLessBtn[data-target="${targetId}"]`);
            if (lessBtn) lessBtn.style.display = 'inline-block';
        });
    });

    document.querySelectorAll('.readLessBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'none';
            btn.style.display = 'none';
            const moreBtn = document.querySelector(`.readMoreBtn[data-target="${targetId}"]`);
            if (moreBtn) moreBtn.style.display = 'inline-block';
        });
    });
}

$(document).ready(function () {
    $("#readMore").click(function () {
        $("#longIntro").show();
        $("#readMore").hide();
        $("#readLess").show();
    });

    $("#readLess").click(function () {
        $("#longIntro").hide();
        $("#readLess").hide();
        $("#readMore").show();
    });
});

window.addEventListener('DOMContentLoaded', () => {
    updateFooterYear();
    displayGreeting();
    activeNav();
    setupTicketInteraction();
    setupReadMoreButtons();
});