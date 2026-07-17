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

    // ---------- Shared: track last focused input/textarea ----------
    let activeInput = null;
    document.addEventListener("focusin", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            activeInput = e.target;
        }
    });

    // ---------- Button factory (shared style) ----------
    function createIconButton(id, offClass, iconClass, title, extraHtml) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.type = "button";
        btn.className = offClass;
        btn.innerHTML = '<i class="fa ' + iconClass + '"></i>' + (extraHtml || "");
        btn.title = title;
        return btn;
    }

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    // ---------- 1. Sinhala Voice Input ----------
    const MIC_OFF_CLASS = "btn btn-outline-primary text-white me-2";
    const MIC_ON_CLASS = "btn btn-primary text-white me-2";

    const sinhalaBtn = createIconButton(
        "voiceBtnSinhala",
        MIC_OFF_CLASS,
        "fa-microphone",
        "Voice Input (si-LK)",
        '&nbsp;<sup>අ</sup>'
    );
    btnGroup.appendChild(sinhalaBtn);

    function setupRecognition(btn, lang) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        let listening = false;

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
                btn.className = MIC_ON_CLASS;
                playSound("toggle_on");
            } else {
                recognition.stop();
                listening = false;
                btn.className = MIC_OFF_CLASS;
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
            btn.className = MIC_OFF_CLASS;
        };
    }

    setupRecognition(sinhalaBtn, "si-LK");

    // ---------- 2. Sinhala Transliteration Toggle ----------
    const TRANSLIT_OFF_CLASS = "btn btn-outline-primary text-white me-2";
    const TRANSLIT_ON_CLASS = "btn btn-primary text-white me-2";

    const translitBtn = createIconButton(
        "voiceBtnTranslit",
        TRANSLIT_OFF_CLASS,
        "fa-language",
        "Toggle Sinhala Transliteration",
        '&nbsp;<sup>අ</sup>'
    );
    btnGroup.appendChild(translitBtn);

    navbar.appendChild(btnGroup);

    let translitOn = false;
    let debounceTimer;
    let options = [];
    let activeIndex = -1;
    let dropdown;

    translitBtn.addEventListener("click", () => {
        translitOn = !translitOn;
        translitBtn.className = translitOn ? TRANSLIT_ON_CLASS : TRANSLIT_OFF_CLASS;

        if (translitOn) {
            document.addEventListener("input", handleTranslitInput);
            document.addEventListener("keydown", handleTranslitKeydown, true);
            playSound("toggle_on");
        } else {
            document.removeEventListener("input", handleTranslitInput);
            document.removeEventListener("keydown", handleTranslitKeydown, true);
            closeDropdown();
            playSound("toggle_off");
        }
    });

    function ensureDropdown() {
        if (dropdown) return dropdown;
        dropdown = document.createElement("div");
        dropdown.id = "siTranslitDropdown";
        dropdown.className = "list-group shadow";
        dropdown.style.position = "absolute";
        dropdown.style.zIndex = "2000";
        dropdown.style.display = "none";
        dropdown.style.minWidth = "140px";
        document.body.appendChild(dropdown);
        return dropdown;
    }

    function handleTranslitInput(e) {
        const el = e.target;
        if (el.tagName !== "TEXTAREA" && !(el.tagName === "INPUT" && el.type === "text")) return;
        if (el.closest("#siTranslitDropdown")) return;

        activeInput = el;

        clearTimeout(debounceTimer);
        const word = getLastWord(el);
        if (!word) {
            closeDropdown();
            return;
        }
        debounceTimer = setTimeout(() => fetchTransliteration(word, el), 200);
    }

    function handleTranslitKeydown(e) {
        const dd = ensureDropdown();
        if (dd.style.display !== "block") return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((activeIndex + 1) % options.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((activeIndex - 1 + options.length) % options.length);
        } else if (e.key === "Enter" || e.key === " ") {
            if (activeIndex >= 0) {
                e.preventDefault();
                selectOption(options[activeIndex]);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeDropdown();
            if (activeInput) activeInput.focus();
        }
    }

    function getLastWord(el) {
        const cursorPos = el.selectionStart;
        const textUpToCursor = el.value.slice(0, cursorPos);
        const match = textUpToCursor.match(/(\S+)$/);
        return match ? match[1] : "";
    }

    async function fetchTransliteration(word, el) {
        try {
            const url = "https://inputtools.google.com/request?text=" +
                encodeURIComponent(word) +
                "&itc=si-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage";
            const res = await fetch(url);
            const data = await res.json();

            if (data[0] === "SUCCESS") {
                options = data[1][0][1];
                renderDropdown(el);
            } else {
                closeDropdown();
            }
        } catch (err) {
            console.error("Transliteration fetch failed:", err);
            closeDropdown();
        }
    }

    function renderDropdown(el) {
        const dd = ensureDropdown();
        if (!options.length) {
            closeDropdown();
            return;
        }
        dd.innerHTML = "";
        options.forEach((opt, i) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "list-group-item list-group-item-action py-1 px-3";
            item.textContent = opt;
            item.onmousedown = (e) => {
                e.preventDefault();
                selectOption(opt);
            };
            dd.appendChild(item);
        });

        activeIndex = 0;
        highlightActive();
        positionDropdown(el);
        dd.style.display = "block";
    }

    function setActive(index) {
        activeIndex = index;
        highlightActive();
    }

    function highlightActive() {
        [...dropdown.children].forEach((el, i) => {
            el.classList.toggle("active", i === activeIndex);
        });
    }

    function selectOption(replacement) {
        const el = activeInput;
        if (!el) return;

        const cursorPos = el.selectionStart;
        const textUpToCursor = el.value.slice(0, cursorPos);
        const textAfterCursor = el.value.slice(cursorPos);

        const newTextUpToCursor = textUpToCursor.replace(/(\S+)$/, replacement + " ");
        el.value = newTextUpToCursor + textAfterCursor;

        const newCursorPos = newTextUpToCursor.length;
        el.focus();
        el.setSelectionRange(newCursorPos, newCursorPos);

        el.dispatchEvent(new Event("input", { bubbles: true }));

        closeDropdown();
    }

    function positionDropdown(el) {
        const dd = ensureDropdown();
        const rect = el.getBoundingClientRect();
        dd.style.left = (rect.left + window.scrollX) + "px";
        dd.style.top = (rect.bottom + window.scrollY + 4) + "px";
    }

    function closeDropdown() {
        if (!dropdown) return;
        dropdown.style.display = "none";
        options = [];
        activeIndex = -1;
    }
}