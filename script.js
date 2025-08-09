// This ensures the script runs after the entire HTML document has been loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Live Clock Functionality ---
    const clockElement = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }

    // Update the clock every second
    setInterval(updateClock, 1000);
    // Initial call to display clock immediately without a 1-second delay
    updateClock();


    // --- Sign-In Modal Functionality ---
    const modal = document.getElementById('signInModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    // Check if all elements exist before adding event listeners
    if (modal && openBtn && closeBtn) {
        // Function to open the modal
        function openModal() {
            modal.style.display = 'flex';
        }

        // Function to close the modal
        function closeModal() {
            modal.style.display = 'none';
        }

        // Event listeners
        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);

        // Close modal if user clicks outside of the modal content
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                closeModal();
            }
        });

        // Optional: Close modal with Escape key
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }

});