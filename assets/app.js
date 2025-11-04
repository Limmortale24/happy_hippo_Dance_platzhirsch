// ======= KONFIGURATION =======
const BACKEND_URL = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Ein Vote pro Gerät
const STORAGE_KEY = "platzhirsch_vote_happyhippo_20260501";
const DEVICE_KEY = "platzhirsch_device_id";
function getOrCreateDeviceId(){
  let id = localStorage.getItem(DEVICE_KEY);
  if(!id){
    id = crypto.randomUUID ? crypto.randomUUID() : (Date.now() + "-" + Math.random().toString(16).slice(2));
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

// ======= Helpers =======
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
    choice: data.get("choice"),
    device_id: getOrCreateDeviceId(),
    ua: navigator.userAgent,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: navigator.language || "",
  };
}

function validate(d) {
  return !!(d.name && d.choice);
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
        setStatus("Du hast bereits abgestimmt (Gerät erkannt).", "warn");
      } else {
        setStatus(data?.message || "Unerwarteter Fehler.", "err");
      }
      btn.disabled = false;
      return;
    }

    localStorage.setItem(STORAGE_KEY, "1");
    setStatus("Danke! Deine Stimme wurde gezählt. Zeig diese Seite am Einlass für dein Freigetränk.", "ok");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus("Netzwerkfehler. Bitte später erneut versuchen.", "err");
    btn.disabled = false;
  }
});
