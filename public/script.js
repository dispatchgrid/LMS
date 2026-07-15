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
    toggle_on: new Audio('/assets/toggle_on.wav'),
    toggle_off: new Audio('/assets/toggle_off.wav'),
    error: new Audio('/assets/error.wav'),
    success: new Audio('/assets/success.wav')
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