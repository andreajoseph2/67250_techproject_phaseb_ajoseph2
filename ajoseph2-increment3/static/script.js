function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
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
window.onload = function() {
    updateFooterYear();
    displayGreeting();
};