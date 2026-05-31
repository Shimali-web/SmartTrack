// Lightweight compatibility layer that replaces Firebase auth calls
// with a local Node/Express backend. This file keeps the same
// `auth` object used by the frontend and exports functions that
// mirror the Firebase API used by the app (createUser..., signIn..., updateProfile).

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

function storageGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export const auth = {
  currentUser: storageGet("unlife_currentUser") || null,
  _token: storageGet("unlife_token") || null,
};

const _listeners = new Set();
function _notify() {
  for (const cb of _listeners) {
    try { cb(auth.currentUser); } catch {}
  }
}

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  if (auth._token) headers["Authorization"] = `Bearer ${auth._token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: { ...headers } });
  if (!res.ok) {
    const errText = await res.text();
    const e = new Error(errText || "Request failed");
    e.status = res.status;
    throw e;
  }
  return res.json().catch(() => ({}));
}

async function signInWithEmailAndPassword(_auth, email, password) {
  const data = await request(`/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  auth.currentUser = data.user;
  auth._token = data.token;
  storageSet("unlife_currentUser", auth.currentUser);
  storageSet("unlife_token", auth._token);
  _notify();
  return data;
}

async function createUserWithEmailAndPassword(_auth, email, password) {
  const data = await request(`/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  auth.currentUser = data.user;
  auth._token = data.token;
  storageSet("unlife_currentUser", auth.currentUser);
  storageSet("unlife_token", auth._token);
  _notify();
  return data;
}

async function updateProfile(user, updateObj) {
  // Accepts { displayName, photoURL }
  if (!auth._token) throw new Error("Not authenticated");
  const data = await request(`/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updateObj) });
  // update local currentUser
  auth.currentUser = { ...(auth.currentUser || {}), ...data.user };
  storageSet("unlife_currentUser", auth.currentUser);
  _notify();
  return data;
}

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile };

// Simple observer to mimic Firebase's onAuthStateChanged
export function onAuthStateChanged(_auth, cb) {
  // call synchronously with current user and subscribe to future changes
  try { cb(auth.currentUser); } catch {}
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

// Sign out helper
auth.signOut = async function () {
  auth.currentUser = null;
  auth._token = null;
  storageSet("unlife_currentUser", null);
  storageSet("unlife_token", null);
  _notify();
  return true;
};