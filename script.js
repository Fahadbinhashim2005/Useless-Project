// This is the updated function in your script.js file
async function handleNormalAICall(userInput) {
    showTypingIndicator();
    try {
        // This now calls YOUR secure backend function at '/api/chat'
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // We send the user's message AND the persona instructions to the backend
            body: JSON.stringify({ 
                message: userInput,
                persona: chatbotPersona 
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const text = data.reply;

        removeTypingIndicator();
        addMessageToUI(text, 'bot');
    } catch (error) {
        console.error("Chatbot Error:", error);
        removeTypingIndicator();
        addMessageToUI("Sorry bro, entho oru technical scene. Pinne try cheyy. 😬", 'bot');
    }
}