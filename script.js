const playlistLinks = {
  happy: "https://www.youtube.com/embed/5qap5aO4i9A",   
  sad: "https://www.youtube.com/embed/jfKfPfyJRdk",     
  stressed: "https://www.youtube.com/embed/7NOSDKb0HlU",
energetic: "https://www.youtube.com/embed/videoseries?list=PLpB8KkZIwFjMmCCSFm4fQe7fht6Orjg34",
tired: "https://www.youtube.com/embed/2OEL4P1Rz04",  
  angry: "https://www.youtube.com/embed/Xn676-fLq7I",  
  burntout: "https://www.youtube.com/embed/5yx6BWlEVcY",
  focused: "https://www.youtube.com/embed/WAifgn2CvoM"
};

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const botResponses = {
  happy: "😄 Feeling happy? Here's a lively study playlist to keep the vibe up! 🎶",
  sad: "😔 Feeling down? Chill beats coming your way to focus and relax.",
  stressed: "😌 Stressed? Take a deep breath and enjoy some calm lofi music.",
  energetic: "⚡ Full energy! Here's some upbeat instrumental tracks to keep you motivated.",
   tired: "😴 Tired? Soft acoustic beats to gently keep you awake but calm.",
  angry: "😡 Angry? Let’s cool down with some soothing instrumentals.",
  burntout: "🥱 Burnt out? Here's ultra-soft lofi to help you recharge slowly.",
  focused: "🎯 Ready to focus? Here's a deep concentration mix for max productivity."
};

function addMessage(content, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
  bubble.textContent = content;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight; 
}

function showTyping() {
  const typing = document.createElement('div');
  typing.classList.add('typing');
  typing.textContent = "🎶 Finding the perfect vibes for you…";
  typing.id = "typing-indicator";
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function botReply(userMood) {
    showTyping();
  setTimeout(() => {
    removeTyping();
    let mood = detectMood(userMood);
  userMood = userMood.toLowerCase();
   if (mood && botResponses[mood]) {
      addMessage(botResponses[mood], 'bot');

    if (playlistLinks[mood]) {
        const iframe = document.createElement('iframe');
        iframe.src = playlistLinks[mood];
        iframe.width = "100%";
        iframe.height = "180"; 
        iframe.style.borderRadius = "12px";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble', 'bot-message');
        bubble.appendChild(iframe);
        chatWindow.appendChild(bubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
  } else {
    addMessage("Hmm, I don't know that vibe 😅 Try: happy, sad, stressed, or energetic.", 'bot');
  }
  }, 1000);
}

sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');   
  userInput.value = '';          
  botReply(message);
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
  chatWindow.innerHTML = ''; 
  addMessage("🎶 Ready to set the vibe? Tell me how you’re feeling — focused, energetic, or burntout!", 'bot');
});

function detectMood(message) {
  message = message.toLowerCase();
  if (message.includes("happy")) return "happy";
  if (message.includes("sad")) return "sad";
  if (message.includes("stress") || message.includes("anxious")) return "stressed";
  if (message.includes("energetic") || message.includes("hype")) return "energetic";
  if (message.includes("tired") || message.includes("sleepy")) return "tired";
  if (message.includes("angry") || message.includes("mad") || message.includes("frustrated")) return "angry";
  if (message.includes("burnt") || message.includes("exhausted")) return "burntout";
  if (message.includes("focus") || message.includes("study")) return "focused";
  return null;
}

const voiceBtn = document.getElementById('voice-btn');

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendBtn.click();
  };

  recognition.onerror = function(event) {
    console.log("Speech recognition error:", event.error);
  };
}

voiceBtn.addEventListener('click', () => {
  if (!recognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }
  recognition.start();
});
