// Family voice recordings (Urdu pronunciation), stored as audio blobs in IndexedDB.

const DB = 'chefLafzVoices';
const STORE = 'recordings';
let dbPromise = null;

function db() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('no indexedDB'));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx(mode, fn) {
  return db().then((d) => new Promise((resolve, reject) => {
    const t = d.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
  }));
}

export const getRecording = (id) => tx('readonly', (s) => s.get(id)).catch(() => null);
export const saveRecording = (id, blob) => tx('readwrite', (s) => s.put(blob, id));
export const deleteRecording = (id) => tx('readwrite', (s) => s.delete(id));
export const countRecordings = () => tx('readonly', (s) => s.count()).catch(() => 0);

export function canRecord() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

// Records until stop() is called (or 6 seconds). Returns { stop, done: Promise<Blob> }.
export async function startRecording(maxMs = 6000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  const done = new Promise((resolve) => {
    rec.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
    };
  });
  rec.start();
  const timer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, maxMs);
  return {
    stop() { clearTimeout(timer); if (rec.state === 'recording') rec.stop(); },
    done,
  };
}
