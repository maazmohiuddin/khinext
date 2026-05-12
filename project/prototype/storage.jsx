// Khinext prototype — localStorage helpers + a tiny pub-sub so the admin
// page re-renders when submissions / registrations change in another tab.

const SUBS_KEY = "khinext.submissions.v1";
const REGS_KEY = "khinext.registrations.v1";

const _listeners = new Set();
function _emit() { _listeners.forEach(fn => fn()); }
function useStore(key) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setTick(t => t + 1);
    _listeners.add(fn);
    const onStorage = (e) => { if (e.key === key) fn(); };
    window.addEventListener("storage", onStorage);
    return () => { _listeners.delete(fn); window.removeEventListener("storage", onStorage); };
  }, [key]);
  return tick;
}

function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); _emit(); } catch (e) { console.warn(e); }
}

// ── Submissions ────────────────────────────────────────────────
function getSubmissions() { return readJSON(SUBS_KEY, []); }
function addSubmission(sub) {
  const subs = getSubmissions();
  const id = "S-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const entry = { id, status: "pending", createdAt: Date.now(), ...sub };
  subs.unshift(entry);
  writeJSON(SUBS_KEY, subs);
  return entry;
}
function updateSubmission(id, patch) {
  const subs = getSubmissions();
  const idx = subs.findIndex(s => s.id === id);
  if (idx < 0) return null;
  subs[idx] = { ...subs[idx], ...patch };
  writeJSON(SUBS_KEY, subs);
  return subs[idx];
}
function clearSubmissions() { writeJSON(SUBS_KEY, []); }

// ── Registrations ──────────────────────────────────────────────
function getRegistrations() { return readJSON(REGS_KEY, []); }
function addRegistration(reg) {
  const regs = getRegistrations();
  const id = "R-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const entry = { id, status: "confirmed", createdAt: Date.now(), ...reg };
  regs.unshift(entry);
  writeJSON(REGS_KEY, regs);
  return entry;
}
function clearRegistrations() { writeJSON(REGS_KEY, []); }

// ── File reading ───────────────────────────────────────────────
// Read a file input into a data URL. Cap at 2.5MB so we don't blow the
// localStorage 5MB quota with one entry.
function fileToDataURL(file, maxBytes = 2_500_000) {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error("File is too large — keep it under 2.5 MB for this demo."));
      return;
    }
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: r.result });
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

// ── Demo seed (only run once if both stores are empty) ─────────
function seedDemoData() {
  if (getSubmissions().length || getRegistrations().length) return;
  addSubmission({
    fullName: "Ayesha Khan", email: "ayesha.k@example.com",
    project: "MediScan AI — radiology triage",
    category: "Health & Pharma",
    description: "An on-device model that flags critical findings in chest X-rays in under 2 seconds, built for low-bandwidth clinics in Sindh.",
    teamSize: "3",
    file: null,
  });
  addSubmission({
    fullName: "Bilal Rauf", email: "bilal@startup.pk",
    project: "PakRupee — fintech sandbox",
    category: "Fintech Future",
    description: "Open API sandbox letting fintech startups prototype against synthetic SBP-compliant data.",
    teamSize: "4",
    file: null,
  });
  addRegistration({
    fullName: "Maham Siddiqui", email: "maham@example.com",
    role: "Student / Developer", track: "AI Expo + Gaming",
  });
}

// Expose globals
Object.assign(window, {
  useStore, SUBS_KEY, REGS_KEY,
  getSubmissions, addSubmission, updateSubmission, clearSubmissions,
  getRegistrations, addRegistration, clearRegistrations,
  fileToDataURL, seedDemoData,
});
