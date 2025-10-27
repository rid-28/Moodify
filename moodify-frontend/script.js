// ===== BOT RESPONSES =====
const botResponses = {
  happy: "😄 Feeling happy? Here are some lively playlists to keep the vibe up! 🎶",
  sad: "😔 Feeling down? Here are some chill beats to help you focus and relax.",
  stressed: "😌 Stressed? Take a deep breath and enjoy some calm music.",
  energetic: "⚡ Full energy! Here are some upbeat tracks to keep you motivated.",
  tired: "😴 Tired? Here are some soft beats to gently keep you awake.",
  angry: "😡 Angry? Let's cool down with some soothing instrumentals.",
  burntout: "🥱 Burnt out? Here's some ultra-soft music to help you recharge.",
  focused: "🎯 Ready to focus? Here are some deep concentration mixes.",
  chill: "😌 Chill vibes activated! Smooth jazz and acoustic covers coming up.",
  creative: "🎨 Creative mode ON! Here's some instrumental electronica.",
  study: "📚 Study session loaded! Classical piano and ambient beats."
};

// ===== PARTICLE BACKGROUND =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 20 + 's';
  particle.style.animationDuration = (15 + Math.random() * 10) + 's';
  particlesContainer.appendChild(particle);
}

// ===== THEME TOGGLE (LIGHT/DARK MODE) =====
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const themeBtn = document.getElementById('theme-btn');
  
  if (document.body.classList.contains('light-mode')) {
    themeBtn.textContent = '🌙'; // Sun icon for light mode
    localStorage.setItem('theme', 'light');
  } else {
    themeBtn.textContent = '☀️'; // Moon icon for dark mode
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme on page load
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-btn').textContent = '☀️';
  }
});

// ===== SESSION STATS TRACKING =====
let messageCount = 0;
let sessionStartTime = Date.now();
let currentMood = 'Ready';

function updateMessageCount() {
  messageCount++;
  document.getElementById('message-count').textContent = messageCount;
}

function updateActiveTime() {
  const elapsed = Date.now() - sessionStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  
  let timeText;
  if (hours > 0) {
    timeText = `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    timeText = `${minutes}m`;
  } else {
    timeText = '0m';
  }
  
  document.getElementById('active-time').textContent = timeText;
}

function updateCurrentMood(mood) {
  currentMood = mood;
  document.getElementById('current-mood').textContent = mood;
}

setInterval(updateActiveTime, 60000);

// ===== CHAT FUNCTIONALITY =====
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// ===== MOOD DETECTION =====
function detectMood(message) {
  message = message.toLowerCase();
  if (message.includes("happy") || message.includes("joy")) return "happy";
  if (message.includes("sad") || message.includes("down")) return "sad";
  if (message.includes("stress") || message.includes("anxious")) return "stressed";
  if (message.includes("energetic") || message.includes("hype") || message.includes("energy") || message.includes("pump")) return "energetic";
  if (message.includes("tired") || message.includes("sleepy")) return "tired";
  if (message.includes("angry") || message.includes("mad") || message.includes("frustrated")) return "angry";
  if (message.includes("burnt") || message.includes("exhausted") || message.includes("burntout")) return "burntout";
  if (message.includes("focus") || message.includes("concentrated") || message.includes("attention")) return "focused";
  if (message.includes("chill") || message.includes("relax") || message.includes("calm") || message.includes("peace")) return "chill";
  if (message.includes("creative") || message.includes("art") || message.includes("design") || message.includes("inspire")) return "creative";
  if (message.includes("study") || message.includes("learn") || message.includes("academic") || message.includes("school")) return "study";
  return null;
}

// ===== ADD MESSAGE TO CHAT =====
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ===== YOUTUBE API - SEARCH PLAYLISTS =====
async function searchYouTubePlaylists(query) {
  try {
    const url = `https://moodify-backend-r95p.onrender.com/yt?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
}

// ===== ADD YOUTUBE PLAYLIST CARD =====
function addPlaylistCard(playlistItem) {
  const playlistId = playlistItem.id.playlistId;
  const title = playlistItem.snippet.title;
  const channelTitle = playlistItem.snippet.channelTitle;
  const thumbnail = playlistItem.snippet.thumbnails.medium.url;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.maxWidth = '85%';
  bubble.style.padding = '12px';
  
  // Playlist card with thumbnail and button
  bubble.innerHTML = `
    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
      <img src="${thumbnail}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
      <div>
        <strong style="font-size: 13px; display: block; margin-bottom: 4px;">${title}</strong>
        <span style="font-size: 11px; color: var(--text-secondary);">by ${channelTitle}</span>
      </div>
    </div>
    <button onclick='playPlaylistInSite("${title.replace(/'/g, "\\'")}","${channelTitle.replace(/'/g, "\\'")}","${thumbnail}","${playlistId}")' 
       style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, var(--neon-cyan), var(--electric-pink)); 
       color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
       🎵 Play This Playlist
    </button>
  `;
  
  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ===== SHOW LOAD MORE BUTTON =====
function showLoadMoreButton(query) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `
    <button onclick='loadMorePlaylists("${query.replace(/'/g, "\\'")}")' 
       style="padding: 10px 20px; background: linear-gradient(135deg, var(--neon-green), var(--neon-cyan)); 
       color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">
       🔄 Show More Playlists
    </button>
  `;
  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ===== LOAD MORE PLAYLISTS =====
async function loadMorePlaylists(query) {
  showTyping();
  const playlists = await searchYouTubePlaylists(query);
  hideTyping();
  
  if (playlists.length > 0) {
    playlists.slice(0, 3).forEach((playlist, index) => {
      setTimeout(() => {
        addPlaylistCard(playlist);
      }, 200 + (index * 300));
    });
  } else {
    addMessage("😅 No more playlists found. Try a different mood!", 'bot');
    updateMessageCount();
  }
}

// ===== PLAY PLAYLIST IN SITE (WITH EMBEDDED PLAYER) =====
function playPlaylistInSite(title, channel, thumbnail, playlistId) {
  // Update right panel "Now Playing" info
  const albumArt = document.querySelector('.album-art');
  if (albumArt) {
    albumArt.style.backgroundImage = `url(${thumbnail})`;
    albumArt.style.backgroundSize = 'cover';
    albumArt.style.backgroundPosition = 'center';
    albumArt.innerHTML = '';
  }
  
  const trackName = document.querySelector('.track-info strong');
  if (trackName) {
    trackName.textContent = title.length > 30 ? title.substring(0, 30) + '...' : title;
  }
  
  const trackDetails = document.querySelector('.track-details');
  if (trackDetails) {
    trackDetails.textContent = channel;
  }
  
  // Create embedded playlist player in chat
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.maxWidth = '90%';
  bubble.style.padding = '10px';
  
  // YouTube playlist iframe embed
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`;
  iframe.width = "100%";
  iframe.height = "300";
  iframe.style.borderRadius = "12px";
  iframe.style.border = "1px solid rgba(255, 255, 255, 0.15)";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  
  bubble.appendChild(iframe);
  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  
  // Confirmation message
  addMessage("🎵 Now playing: " + title, 'bot');
  updateMessageCount();
}

// ===== TYPING INDICATOR =====
let typingIndicator;
function showTyping() {
  typingIndicator = document.createElement('div');
  typingIndicator.className = 'message bot-message';
  typingIndicator.id = 'typing-indicator';
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing';
  typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  typingIndicator.appendChild(typingDiv);
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// ===== BETTER QUERY BUILDER =====
function buildSmartQuery(mood, userMessage) {
  const moodQueries = {
    happy: ["happy music playlist", "upbeat songs playlist", "positive vibes playlist"],
    sad: ["sad music playlist", "emotional songs playlist", "melancholic playlist"],
    stressed: ["relaxing music playlist", "stress relief playlist", "calm music playlist"],
    energetic: ["high energy playlist", "workout music playlist", "pump up songs"],
    tired: ["soft music playlist", "gentle playlist", "peaceful songs playlist"],
    angry: ["calming music playlist", "peaceful playlist", "meditation music"],
    burntout: ["healing music playlist", "recovery playlist", "gentle sounds playlist"],
    focused: ["focus music playlist", "concentration playlist", "study beats playlist"],
    chill: ["chill music playlist", "lofi hip hop playlist", "relaxing beats playlist"],
    creative: ["creative music playlist", "instrumental playlist", "ambient music playlist"],
    study: ["study music playlist", "lofi study playlist", "concentration music playlist"]
  };

  const queries = moodQueries[mood] || [userMessage + " playlist"];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  return randomQuery;
}

// ===== UPDATED GENERATE RESPONSE =====
async function generateResponse(userMessage) {
  const mood = detectMood(userMessage);
  
  if (mood) {
    const moodNames = {
      happy: "Happy 😄",
      sad: "Sad 😔",
      stressed: "Stressed 😌",
      energetic: "Energetic ⚡",
      tired: "Tired 😴",
      angry: "Angry 😡",
      burntout: "Burnt Out 🥱",
      focused: "Focused 🎯",
      chill: "Chill 😌",
      creative: "Creative 🎨",
      study: "Study Mode 📚"
    };
    updateCurrentMood(moodNames[mood]);
    
    addMessage(botResponses[mood], 'bot');
    updateMessageCount();

    const searchQuery = buildSmartQuery(mood, userMessage);
    const playlists = await searchYouTubePlaylists(searchQuery);
    
    if (playlists.length > 0) {
      // Show 3 playlists with staggered timing
      playlists.slice(0, 3).forEach((playlist, index) => {
        setTimeout(() => {
          addPlaylistCard(playlist);
        }, 800 + (index * 400));
      });

      setTimeout(() => {
    showLoadMoreButton(searchQuery);
  }, 800 + (3 * 400)); // Show after all 3 playlists

    } else {
      addMessage("😅 No playlists found for that mood. Try rephrasing or check your internet connection! Try: happy, sad, energetic, focused, chill, creative, study, burnt out.", 'bot');
  updateMessageCount();
}
    
  } else {
    addMessage("🎵 Let me find some playlists for you...", 'bot');
    updateMessageCount();
    
    const playlists = await searchYouTubePlaylists(userMessage + " music playlist");
    
    if (playlists.length > 0) {
      playlists.slice(0, 3).forEach((playlist, index) => {
        setTimeout(() => {
          addPlaylistCard(playlist);
        }, 800 + (index * 400));
      });
    } else {
      addMessage("😅 Try: happy, sad, energetic, focused, chill, etc.", 'bot');
      updateMessageCount();
    }
  }
}
// ===== SEND MESSAGE =====
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  addMessage(message, 'user');
  updateMessageCount();
  
  userInput.value = '';
  showTyping();
  
  setTimeout(async () => {
    hideTyping();
    await generateResponse(message);
  }, 1500);
}

// ===== CLEAR CHAT =====
function clearChat() {
  chatWindow.innerHTML = `
    <div class="message bot-message">
      <div class="bubble">Books open, headphones on. What's the mood today — focused, energetic, or burntout?</div>
    </div>
  `;
  
  messageCount = 0;
  sessionStartTime = Date.now();
  document.getElementById('message-count').textContent = '0';
  document.getElementById('active-time').textContent = '0m';
  updateCurrentMood('Ready');
}

// ===== QUICK MOOD BUTTONS =====
function quickMood(mood) {
  userInput.value = mood;
  sendMessage();
}

// ===== VOICE INPUT =====
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input not supported in your browser. Try Chrome or Edge!');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage();
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };
}
