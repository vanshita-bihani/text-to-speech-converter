let speech = new SpeechSynthesisUtterance();
let voices = [];

let voiceSelect = document.querySelector("#voiceSelect");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

document.querySelector("#speakButton").addEventListener("click", () => {
    speech.text = document.querySelector("#textarea").value;
    window.speechSynthesis.speak(speech);
});

async function getChatGPTResponse(prompt) {
    const apiKey = 'your_openai_api_key';  // Replace with your OpenAI API key

    try {
        console.log('Sending request to OpenAI API with prompt:', prompt);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const data = await response.json();
        console.log('Received response:', data);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`, data);
            throw new Error(`HTTP error! status: ${response.status} - ${data.error.message}`);
        }

        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        return 'Sorry, I could not get a response.';
    }
}

document.querySelector("#askButton").addEventListener("click", async () => {
    const query = document.querySelector("#textarea").value;
    if (!query) {
        alert("Please enter a query.");
        return;
    }

    console.log('Querying ChatGPT with:', query);
    const response = await getChatGPTResponse(query);
    console.log('Response from ChatGPT:', response);

    const textarea = document.querySelector("#textarea");
    textarea.value += `\n\nChatGPT: ${response}`;
    speech.text = response;
    window.speechSynthesis.speak(speech);
});
