/**
 * audioUnlock.js
 *
 * Both Chrome and Safari require a user gesture before AudioContext /
 * speechSynthesis will work.  Call unlockAudio() inside any click/touch
 * handler — typically on the first interaction with the page.
 *
 * What it does
 * ─────────────
 * 1. Creates (or resumes) the shared AudioContext used by useSound.js
 * 2. Plays a 1-sample silent buffer through it — this satisfies Chrome's
 *    autoplay policy and moves the context from "suspended" → "running"
 * 3. Primes speechSynthesis with an empty utterance so subsequent
 *    auto-speak calls (inside useEffect / setTimeout) are not blocked
 */

let _unlocked = false

export function isAudioUnlocked() {
  return _unlocked
}

export function unlockAudio() {
  if (_unlocked) return
  _unlocked = true

  // ── 1. AudioContext (used by useSound.js) ──────────────────────────────
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (Ctx) {
      // Reuse existing context if already created by useSound
      const ctx = window._audioCtx || new Ctx()
      window._audioCtx    = ctx
      window._noiseBuffer = null          // force buffer rebuild with new ctx

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      // Play a 1-sample silent buffer — the actual "unlock gesture"
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate)
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(ctx.destination)
      src.start(0)
    }
  } catch (_) { /* ignore */ }

  // ── 2. speechSynthesis primer ──────────────────────────────────────────
  // Speaking an empty zero-volume utterance "unlocks" the synth so that
  // subsequent speak() calls from useEffect/setTimeout are not blocked.
  try {
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      u.rate   = 10          // finish as fast as possible
      window.speechSynthesis.speak(u)
      // Cancel immediately — we only needed the gesture registration
      setTimeout(() => window.speechSynthesis?.cancel(), 50)
    }
  } catch (_) { /* ignore */ }
}
