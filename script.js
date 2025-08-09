// This ensures the script runs after the entire HTML document has been loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Element Selection ---
    const clockElement = document.getElementById('clock');

    // --- Helper function to get the current time in IST ---
    function createISTDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + (330 * 60000)); // IST is UTC+5:30 (330 minutes)
        return istTime;
    }

    // --- Reverse Clock Functionality (IST-aware) ---
    function updateReverseClock() {
        // Set the font size consistently
        clockElement.style.fontSize = "3.5rem";
        
        // Get the current time in India
        const now = createISTDate();
        const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const totalSecondsInDay = 86400;
        const secondsRemaining = totalSecondsInDay - secondsPassed;

        const remainingHours = Math.floor(secondsRemaining / 3600);
        const remainingMinutes = Math.floor((secondsRemaining % 3600) / 60);
        const remainingSeconds = secondsRemaining % 60;

        const displayHours = remainingHours.toString().padStart(2, '0');
        const displayMinutes = remainingMinutes.toString().padStart(2, '0');
        const displaySeconds = remainingSeconds.toString().padStart(2, '0');

        clockElement.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
    }

    // --- Main Clock Interval ---
    setInterval(updateReverseClock, 1000);
    updateReverseClock(); // Initial call to display clock immediately

    // --- Sign-In Modal Functionality (Unchanged) ---
    const modal = document.getElementById('signInModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    if (modal && openBtn && closeBtn) {
        function openModal() {
            modal.style.display = 'flex';
        }
        function closeModal() {
            modal.style.display = 'none';
        }
        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                closeModal();
            }
        });
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
});