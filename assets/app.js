// ======= KONFIGURATION =======
// Trage hier nach der Web‑App‑Veröffentlichung die URL aus backend/Code.gs ein:
const BACKEND_URL = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE"; // z.B. https://script.google.com/macros/s/AKfycby.../exec

// Lokale Sperre: verhindert Mehrfachabgabe vom gleichen Gerät
const STORAGE_KEY = "platzhirsch_vote_happyhippo_20260501";

// ======= Hilfsfunktionen =======
const $ = (sel) => document.querySelector(sel);
const statusEl = $("#status");

function setStatus(msg, kind = "") {
  statusEl.className = "status" + (kind ? " " + kind : "");
  statusEl.textContent = msg;
}

function getFormData(form) {
  const data = new FormData(form);
  return {
    name: data.get("name")?.trim(),
    email: data.get("email")?.trim().toLowerCase(),
    phone: data.get("phone")?.trim() || "",
    choice: data.get("choice"),
    ua: navigator.userAgent,
  };
}

function validate(d) {
  if (!d.name || !d.email || !d.choice) return false;
  return /.+@.+\..+/.test(d.email);
}

// ======= Datenschutz Dialog =======
const privacyDialog = document.querySelector('#privacyDialog');
document.querySelector('#privacyLink').addEventListener('click', (e)=>{
  e.preventDefault();
  privacyDialog.showModal();
});

// ======= Submit =======
const form = document.getElementById("voteForm");
const btn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (localStorage.getItem(STORAGE_KEY)) {
    setStatus("Du hast bereits abgestimmt (Gerätesperre).", "warn");
    return;
  }

  const payload = getFormData(form);
  if (!validate(payload)) {
    setStatus("Bitte fülle alle Pflichtfelder korrekt aus.", "err");
    return;
  }

  try {
    btn.disabled = true;
    setStatus("Sende deine Stimme …");

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        setStatus("Du hast bereits abgestimmt (E‑Mail/Telefon erkannt).", "warn");
      } else {
        setStatus(data?.message || "Unerwarteter Fehler.", "err");
      }
      btn.disabled = false;
      return;
    }

    // Erfolg
    localStorage.setItem(STORAGE_KEY, "1");
    setStatus("Danke! Deine Stimme wurde gezählt. Zeig diese Seite am Einlass für dein Freigetränk.", "ok");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus("Netzwerkfehler. Bitte später erneut versuchen.", "err");
    btn.disabled = false;
  }
});
