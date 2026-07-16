document.addEventListener("DOMContentLoaded", () => {
    const quitBtn = document.getElementById("quitBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const navbarTxt = document.getElementById("navbarTxt");

    if (quitBtn) {
        quitBtn.addEventListener("click", () => {
            window.location.href = "/goodbye";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "/deauthenticate";
        });
    }

    if (navbarTxt) {
        navbarTxt.innerHTML = `<a href="/dashboard" class="text-decoration-none text-light">Library Management System </a>`;
    }
});

// Preload multiple sounds
const sounds = {
    toggle_on: new Audio('/assets/transition_up.wav'),
    toggle_off: new Audio('/assets/transition_down.wav'),
    error: new Audio('/assets/caution.wav'),
    success: new Audio('/assets/button.wav')
};

// Ensure all are preloaded
Object.values(sounds).forEach(audio => {
    audio.preload = 'auto';
});

// Utility function to play by name
function playSound(name) {
    const sound = sounds[name];
    if (sound) {
        sound.currentTime = 0; // reset to start
        sound.play()
            .catch(err => console.error(`Failed to play ${name}:`, err));
    } else {
        console.warn(`Sound "${name}" not found`);
    }
}




//Mic Button for Voice Recognizion

const navbar = document.getElementById("navbarContent");
if (navbar) {
    function createMicButton(id, lang, supLetter) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.className = "btn btn-success me-2"; // Bootstrap spacing: margin-end
        btn.innerHTML = '<i class="fa fa-microphone"></i>&nbsp;<sup>' + supLetter + '</sup>';
        btn.title = "Voice Input (" + lang + ")";
        return btn;
    }

    const sinhalaBtn = createMicButton("voiceBtnSinhala", "si-LK", "අ");
    const englishBtn = createMicButton("voiceBtnEnglish", "en-US", "e");

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group"; // Bootstrap button group
    btnGroup.appendChild(sinhalaBtn);
    btnGroup.appendChild(englishBtn);
    navbar.appendChild(btnGroup);

    function setupRecognition(btn, lang) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        let activeInput = null;
        let listening = false;

        document.addEventListener("focusin", (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
                activeInput = e.target;
            }
        });

        function sanitizeText(text) {
            return text.replace(/[*~_`<>,."'']/g, "").trim();
        }

        btn.addEventListener("click", () => {
            if (!activeInput) {
                alert("Click a text field first!");
                return;
            }
            if (!listening) {
                recognition.start();
                listening = true;
                btn.className = "btn btn-danger me-2";
                playSound("toggle_on");
            } else {
                recognition.stop();
                listening = false;
                btn.className = "btn btn-success me-2";
                playSound("toggle_off");
            }
        });

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            activeInput.value = sanitizeText(transcript);
        };

        recognition.onerror = () => {
            listening = false;
            btn.className = "btn btn-success me-2";
            playSound("toggle_off");
        };
    }

    setupRecognition(sinhalaBtn, "si-LK");
    setupRecognition(englishBtn, "en-US");
}

