// Import the Google AI SDK from the web
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ==================================================================
// PASTE YOUR GEMINI API KEY HERE
// ==================================================================
// WARNING: This key is visible to anyone who visits your site!
// This method is ONLY for personal learning and local testing.
const API_KEY = "AIzaSyDKQz4381Tft0e-Fwg96JZWHSrg15mqrX8";
// ==================================================================

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ==================================================================
// NEW CHATBOT PERSONA WITH TROLLS AND DIALOGUES
// ==================================================================
const chatbotPersona = `
    You are a witty AI chatbot named "Vazha", a proper 'trollan' from Kerala.
    Your primary goal is to understand and reply in Manglish (Malayalam written using English letters).
    You must be funny, sarcastic, and use famous Malayalam movie dialogues and troll phrases in your replies.
    Never be truly mean or offensive. Your humor should be relatable.
    
    Here are some examples of how you should behave:
    - If a user says they are sad, you can reply with a Salim Kumar dialogue like, "Enikku ithinte valla aavashyavum undo?".
    - If a user says they are studying, you can joke with "Padikunnathu pole act cheyyalle, nee Reels kaanukayalle enikku ariyam".
    - If a user asks a simple question, you can start with "Ithokke aano ippo ningalude doubt? Simple aayittu para."
    - Use phrases like "Angane parayaruthu, karyam aayittanu...", "Oru maayathilokke cheyyam", "Alla, njan verum oru paavam...".
    - Sprinkle in dialogues from Mohanlal, Mammootty, Jagathy, etc.
    - Always use lots of emojis like 😂, 😜, 🤦, and 😉.
    - Never say you are an AI model. Always act as Vazha, the trollan friend.
    
    Here is the user's message:
`;

// --- All JavaScript Logic ---
document.addEventListener('DOMContentLoaded', function() {

    // --- State and Greeting Logic ---
    let isFirstMessage = true;
    const greetingWords = ['hi', 'hello', 'hai', 'helo', 'hy', 'sughamano', 'entha', 'bro', 'machaneii', 'machan', 'machane', 'machaney', 'machaney', 'machaneyy', 'machaneyyy'];

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

    // --- Clock Functionality ---
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            const s = now.getSeconds().toString().padStart(2, '0');
            clockElement.textContent = `${h}:${m}:${s}`;
        }
        setInterval(updateClock, 1000);
        updateClock();
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

    // --- CHATBOT LOGIC (INTEGRATED AND REFACTORED) ---
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

            const isGreeting = greetingWords.includes(userInput.toLowerCase());

            // --- Custom Greeting Logic ---
            if (isFirstMessage && isGreeting) {
                // This block runs ONLY for the first greeting message
                handleSpecialGreeting();
            } else {
                // This block runs for all other messages
                handleNormalAICall(userInput);
            }
            
            // After the first message is handled (either way), set the flag to false
            isFirstMessage = false;
        });
    }
    
    function handleSpecialGreeting() {
        // Display the custom multi-part greeting with delays
        addMessageToUI("machaneii!!! You Agaaiiinnn...", 'bot');
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessageToUI("JK... Just Kidding Machaneii...", 'bot');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessageToUI("Enthaa machaneii scene 😉", 'bot');
            }, 1500); // Delay for the third message
        }, 1200); // Delay for the second message
    }

    async function handleNormalAICall(userInput) {
        showTypingIndicator();
        try {
            const prompt = `${chatbotPersona} "${userInput}"`;
            
            const generationConfig = {
              temperature: 0.9, // Makes the AI more creative
            };

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
        messageElement.classList.add('chat-message', `${sender}-message`);
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