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
      navbarTxt.innerHTML = "Library Management System";
    }
  });