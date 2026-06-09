// Procedural Sound Effects Generator using Web Audio API
// This avoids needing heavy audio files and supports offline, low-latency playback

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Side-to-side (horizontal) movement tick
export function playHorizontalTick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn("Audio failed", e);
  }
}

// Up-and-down (vertical) movement tick
export function playVerticalTick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn("Audio failed", e);
  }
}

// Celebratory Success Chime arpeggio
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (C Major arpeggio)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const playTime = now + idx * 0.08;
      gainNode.gain.setValueAtTime(0.0, playTime);
      gainNode.gain.linearRampToValueAtTime(0.12, playTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, playTime + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(playTime);
      osc.stop(playTime + 0.35);
    });
  } catch (e) {
    console.warn("Audio failed", e);
  }
}

// Sad failure buzz
export function playFailureSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.35);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn("Audio failed", e);
  }
}

// Retro cash register "cha-ching" chime for purchases
export function playPurchaseSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First ping (mid-high)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.0, now);
    gain1.gain.linearRampToValueAtTime(0.10, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second ping (high) starting slightly later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.06); // E6
    gain2.gain.setValueAtTime(0.0, now + 0.06);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.warn("Audio failed", e);
  }
}
