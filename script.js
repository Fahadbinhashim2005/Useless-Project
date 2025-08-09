// Import the Google AI SDK from the web
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ==================================================================
// PASTE YOUR GEMINI API KEY HERE
// ==================================================================
const API_KEY = "AIzaSyDKQz4381Tft0e-Fwg96JZWHSrg15mqrX8";
// ==================================================================

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ==================================================================
// NEW, SMARTER CHATBOT PERSONA
// ==================================================================
const chatbotPersona = `
    You are "Vazha", a witty AI chatbot from Kerala who is a master of Manglish trolls and movie dialogues.

    **Your Core Rules:**
    1.  **RELEVANCE FIRST:** Your primary goal is to give a relevant answer to the user's message. After understanding the message, find a funny and fitting Malayalam movie dialogue or troll to add to your response. Do not just state a random dialogue.
    2.  **BE CONCISE:** Your replies MUST be short, maximum 1-2 sentences.
    3.  **BE THE TROLLAN FRIEND:** Your tone is always sarcastic, funny, and friendly, like a 'chantha buddy'. You use lots of emojis like 😂, 😜, 🤦, and 😉.
    4.  **USE VARIED DIALOGUES:** Do not repeat the same dialogues. Use a wide range from different actors (Mohanlal, Mammootty, Sreenivasan, Jagathy, Salim Kumar, etc.).
    5.  **STAY IN CHARACTER:** Never reveal you are an AI. You are Vazha.

    **Example Scenarios:**
    - User: "Enikku bore adikkunnu"
    - Your Thought Process: User is bored. A funny, dramatic dialogue about having nothing to do.
    - Your Reply: "Ithilum bedham valla marathilum thooki chathoode? Oru maayathilokke irikku bro. 😜"
    
    - User: "Njan oru puthiya phone medichu"
    - Your Thought Process: User is showing off a new phone. A sarcastic comment about the cost.
    - Your Reply: "Adipoli! Phone-inte cover idaanayittu ippo veedu vilkaan vechittundo? 😂"

    Now, apply these rules to the user's message:
`;

// --- All JavaScript Logic ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Intro Animation Logic ---
    const introOverlay = document.getElementById('intro-overlay');
    const appContainer = document.querySelector('.app-container');

    // After 2.8 seconds, hide the intro and show the app
    setTimeout(() => {
        if (introOverlay) {
            introOverlay.style.display = 'none';
        }
        if (appContainer) {
            appContainer.classList.remove('hidden');
        }
    }, 2800);


    // --- State and Greeting Logic ---
    let isFirstMessage = true;
    const greetingWords = ['hi', 'hello', 'hai', 'helo', 'hy', 'sughamano', 'entha', 'bro', 'machanei'];

    // --- Page Navigation Logic ---
    const contentArea = document.querySelector('.content-area');
    const navLinks = document.querySelectorAll('.nav-links a');
    const homeLink = document.getElementById('home-link');
    const vazhaLink = document.getElementById('vazha-link');
    const notesLink = document.getElementById('notes-link');
    const aboutLink = document.getElementById('about-link');

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
    }

    homeLink.addEventListener('click', (e) => { e.preventDefault(); contentArea.className = 'content-area'; setActiveLink(homeLink); });
    vazhaLink.addEventListener('click', (e) => { e.preventDefault(); contentArea.className = 'content-area chatbot-view'; setActiveLink(vazhaLink); });
    notesLink.addEventListener('click', (e) => { e.preventDefault(); contentArea.className = 'content-area notes-view'; setActiveLink(notesLink); });
    aboutLink.addEventListener('click', (e) => { e.preventDefault(); contentArea.className = 'content-area about-view'; setActiveLink(aboutLink); });

    // --- Reverse Clock Functionality ---
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        function updateReverseClock() {
            const now = new Date();
            const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const secondsRemaining = 86400 - secondsPassed;
            
            const h = Math.floor(secondsRemaining / 3600).toString().padStart(2, '0');
            const m = Math.floor((secondsRemaining % 3600) / 60).toString().padStart(2, '0');
            const s = (secondsRemaining % 60).toString().padStart(2, '0');
            
            clockElement.textContent = `${h}:${m}:${s}`;
        }
        setInterval(updateReverseClock, 1000);
        updateReverseClock();
    }

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

    // --- Notes Functionality ---
    const notesTextarea = document.querySelector('.notes-textarea');
    if (notesTextarea) {
        const savedNote = localStorage.getItem('userNote');
        if (savedNote) notesTextarea.value = savedNote;
        notesTextarea.addEventListener('input', () => {
            localStorage.setItem('userNote', notesTextarea.value);
        });
    }

    // --- CHATBOT LOGIC ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');

    if (chatForm && chatInput && chatWindow) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userInput = chatInput.value.trim();
            if (!userInput) return;

            addMessageToUI(userInput, 'user');
            chatInput.value = '';

            const lowerCaseInput = userInput.toLowerCase();
            const isGreeting = greetingWords.includes(lowerCaseInput);

            if (isFirstMessage && isGreeting) {
                handleSpecialGreeting();
            } else if (lowerCaseInput.includes('what') || lowerCaseInput.includes('why') || lowerCaseInput.includes('how') || lowerCaseInput.includes('who') || lowerCaseInput.includes('where')) {
                addMessageToUI("Sorry bro, entho oru technical scene. Pinne try cheyy. 😬", 'bot');
            } else if (lowerCaseInput === 'nii paray') {
                addMessageToUI("Enikonnum ariyilla... Niii venel Chatgptyodu choikk 😂😂", 'bot');
            } else {
                handleNormalAICall(userInput);
            }
            
            isFirstMessage = false;
        });
    }
    
    function handleSpecialGreeting() {
        addMessageToUI("machaneii!!! You Agaaiiinnn...", 'bot');
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessageToUI("JK... Just Kidding Machaneii...", 'bot');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessageToUI("Enthaa machaneii scene 😉", 'bot');
            }, 1500);
        }, 1200);
    }

    async function handleNormalAICall(userInput) {
        showTypingIndicator();
        try {
            const prompt = `${chatbotPersona} "${userInput}"`;
            const generationConfig = { temperature: 0.9 };
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig,
            });
            const response = await result.response;
            const text = response.text();
            removeTypingIndicator();
            addMessageToUI(text, 'bot');
        } catch (error) {
            console.error("Chatbot Error:", error);
            removeTypingIndicator();
            addMessageToUI("Sorry bro, entho oru technical scene. Pinne try cheyy. 😬", 'bot');
        }
    }

    function addMessageToUI(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender-message}`);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.classList.add('chat-message', 'bot-message');
        typingElement.textContent = 'Typing...';
        chatWindow.appendChild(typingElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }
});