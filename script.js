document.addEventListener('DOMContentLoaded', function() {

    // --- Page Navigation Logic ---
    const contentArea = document.querySelector('.content-area');
    const navLinks = document.querySelectorAll('.nav-links a');
    const homeLink = document.getElementById('home-link');
    const vazhaLink = document.getElementById('vazha-link');
    const notesLink = document.getElementById('notes-link');
    const aboutLink = document.getElementById('about-link');

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        contentArea.classList.remove('chatbot-view', 'notes-view', 'about-view');
        setActiveLink(homeLink);
    });

    vazhaLink.addEventListener('click', function(e) {
        e.preventDefault();
        contentArea.classList.remove('notes-view', 'about-view');
        contentArea.classList.add('chatbot-view');
        setActiveLink(vazhaLink);
    });

    notesLink.addEventListener('click', function(e) {
        e.preventDefault();
        contentArea.classList.remove('chatbot-view', 'about-view');
        contentArea.classList.add('notes-view');
        setActiveLink(notesLink);
    });

    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        contentArea.classList.remove('chatbot-view', 'notes-view');
        contentArea.classList.add('about-view');
        setActiveLink(aboutLink);
    });
    

    // --- Reverse Clock Functionality ---
    const clockElement = document.getElementById('clock');
    function createISTDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + (330 * 60000));
        return istTime;
    }
    function updateReverseClock() {
        clockElement.style.fontSize = "3rem";
        const now = createISTDate();
        const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const secondsRemaining = 86400 - secondsPassed;
        const h = Math.floor(secondsRemaining / 3600).toString().padStart(2, '0');
        const m = Math.floor((secondsRemaining % 3600) / 60).toString().padStart(2, '0');
        const s = (secondsRemaining % 60).toString().padStart(2, '0');
        clockElement.textContent = `${h}:${m}:${s}`;
    }
    setInterval(updateReverseClock, 1000);
    updateReverseClock();


    // --- Sign-In Modal Functionality ---
    const modal = document.getElementById('signInModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    if (modal && openBtn && closeBtn) {
        function openModal() { modal.style.display = 'flex'; }
        function closeModal() { modal.style.display = 'none'; }
        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }


    // --- Forgetful Notes Functionality ---
    const notesTextarea = document.querySelector('.notes-textarea');
    let forgetTimer;
    function startForgetTimer() {
        clearTimeout(forgetTimer);
        forgetTimer = setTimeout(() => {
            notesTextarea.value = '';
            localStorage.removeItem('userNote');
        }, 60000);
    }
    const savedNote = localStorage.getItem('userNote');
    if (savedNote) {
        notesTextarea.value = savedNote;
        startForgetTimer();
    }
    notesTextarea.addEventListener('input', () => {
        localStorage.setItem('userNote', notesTextarea.value);
        startForgetTimer();
    });
});