/* chip.js — motor de áudio 8-bit estilo NES (WebAudio puro)
   2 canais de pulso (duty 25% / 12.5%), triângulo (baixo), ruído (percussão),
   envelopes, vibrato, slide e sequenciador de música em loop. */
"use strict";
window.AU = (() => {
  let ctx = null, master = null, noiseBuf = null;
  const waves = {};
  let sfxOn = true, musOn = true;

  function init() {
    if (ctx) return;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    const comp = ctx.createDynamicsCompressor();
    master = ctx.createGain(); master.gain.value = .9;
    master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function duty(dc) { // onda quadrada com duty cycle (assinatura NES)
    if (waves[dc]) return waves[dc];
    const n = 32, real = new Float32Array(n), imag = new Float32Array(n);
    for (let k = 1; k < n; k++) imag[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * dc);
    return (waves[dc] = ctx.createPeriodicWave(real, imag));
  }
  const mid = m => 440 * Math.pow(2, (m - 69) / 12);

  function tone({ f, m, t = 0, dur = .1, type = "sq25", vol = .12, slide = 0, vib = 0 }) {
    if (!ctx) return;
    if (m) f = mid(m);
    const start = ctx.currentTime + t;
    const o = ctx.createOscillator(), g = ctx.createGain();
    if (type === "sq25") o.setPeriodicWave(duty(.25));
    else if (type === "sq12") o.setPeriodicWave(duty(.125));
    else if (type === "sq50") o.type = "square";
    else o.type = type; // triangle | sawtooth | sine
    o.frequency.setValueAtTime(f, start);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(24, f + slide), start + dur);
    if (vib) {
      const lf = ctx.createOscillator(), lg = ctx.createGain();
      lf.frequency.value = 6; lg.gain.value = vib;
      lf.connect(lg); lg.connect(o.frequency); lf.start(start); lf.stop(start + dur + .05);
    }
    g.gain.setValueAtTime(.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + .006);
    g.gain.exponentialRampToValueAtTime(.001, start + dur);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + dur + .06);
  }
  function noise({ t = 0, dur = .07, vol = .14, hp = false, fr = 0 }) {
    if (!ctx) return;
    const start = ctx.currentTime + t;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = hp ? "highpass" : "lowpass"; f.frequency.value = fr || (hp ? 6000 : 900);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(.001, start + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(start); s.stop(start + dur + .02);
  }
  const S = fn => { if (sfxOn && ctx) fn(); };

  /* ================= SFX ================= */
  const sfx = {
    coin()  { S(() => { tone({ m: 83, dur: .08, vol: .14 }); tone({ m: 88, dur: .32, vol: .14, t: .08 }); }); },
    sel()   { S(() => tone({ m: 76, dur: .045, vol: .07, type: "sq12" })); },
    ok()    { S(() => { tone({ m: 72, dur: .05, vol: .1 }); tone({ m: 76, dur: .05, vol: .1, t: .05 }); tone({ m: 79, dur: .1, vol: .11, t: .1 }); }); },
    bad()   { S(() => { tone({ m: 45, dur: .22, vol: .14, type: "sq50", slide: -30 }); noise({ dur: .25, vol: .12 }); tone({ m: 41, dur: .3, vol: .12, type: "sq50", t: .18, slide: -20 }); }); },
    stage() { S(() => { [72, 76, 79, 84].forEach((m, i) => tone({ m, dur: .11, vol: .12, t: i * .1 })); [72, 76, 79, 84].forEach((m, i) => tone({ m: m + 12, dur: .09, vol: .05, t: .05 + i * .1, type: "sq12" })); noise({ t: .4, dur: .18, vol: .1, hp: true }); }); },
    boss()  { S(() => { [43, 42, 41, 40].forEach((m, i) => { tone({ m, dur: .22, vol: .13, type: "sq50", t: i * .2, vib: 4 }); noise({ t: i * .2, dur: .12, vol: .08 }); }); }); },
    win()   { S(() => { const mel = [72, 72, 72, 76, 79, 84]; mel.forEach((m, i) => { tone({ m, dur: .15, vol: .13, t: i * .13 }); tone({ m: m - 12, dur: .15, vol: .07, t: i * .13, type: "triangle" }); }); tone({ m: 88, dur: .5, vol: .12, t: .82, vib: 5 }); noise({ t: .82, dur: .3, vol: .1, hp: true }); }); },
    meh()   { S(() => [76, 74, 72].forEach((m, i) => tone({ m, dur: .2, vol: .11, type: "triangle", t: i * .22 }))); },
    lose()  { S(() => { [55, 51, 48, 43].forEach((m, i) => tone({ m, dur: .3, vol: .13, type: "sq50", t: i * .26, slide: -15 })); noise({ t: .9, dur: .5, vol: .14 }); }); },
    b(f, d = .07, type = "square", v = .1) { S(() => tone({ f, dur: d, type: type === "square" ? "sq50" : type, vol: v })); },
  };

  /* ================= MÚSICA (sequenciador) =================
     padrões de 32 passos (colcheias). _ = silêncio (null). */
  const _ = null;
  const SONGS = {
    quest: { bpm: 150,
      bass: [45,_,45,_,48,_,45,_, 43,_,43,_,47,_,43,_, 41,_,41,_,45,_,41,_, 43,_,43,_,47,_,50,_],
      lead: [69,_,_,72,74,_,76,_, 74,_,72,_,69,_,_,_, 67,_,_,69,72,_,74,_, 72,_,69,_,67,_,_,_],
      leadType: "sq25", leadVol: .045, kick: [0,8,16,24], hatEvery: 2 },
    tension: { bpm: 116,
      bass: [45,_,_,_,45,_,_,45, 44,_,_,_,44,_,_,44, 43,_,_,_,43,_,_,43, 46,_,_,_,44,_,_,_],
      lead: [_,_,57,_,_,_,56,_, _,_,_,_,53,_,_,_, _,_,51,_,_,_,_,_, 56,_,_,55,_,_,_,_],
      leadType: "sq12", leadVol: .04, kick: [0,16], hatEvery: 4 },
  };
  let musTimer = null, step = 0, cur = null;
  function music(name) {
    if (musTimer) { clearInterval(musTimer); musTimer = null; }
    cur = name ? SONGS[name] : null; step = 0;
    if (!cur || !musOn || !ctx) return;
    const stepDur = 60 / cur.bpm / 2; // colcheia
    musTimer = setInterval(() => {
      if (!musOn || !cur) return;
      const i = step % 32;
      const b = cur.bass[i], l = cur.lead[i];
      if (b != null) tone({ m: b, dur: stepDur * .9, type: "triangle", vol: .075 });
      if (l != null) tone({ m: l, dur: stepDur * 1.7, type: cur.leadType, vol: cur.leadVol, vib: 3 });
      if (cur.kick.includes(i)) noise({ dur: .09, vol: .09, fr: 350 });
      if (i % cur.hatEvery === 0) noise({ dur: .03, vol: .035, hp: true });
      step++;
    }, stepDur * 1000);
  }

  return {
    init,
    ...sfx,
    music,
    get sfxOn() { return sfxOn; },
    get musOn() { return musOn; },
    toggleSfx() { init(); sfxOn = !sfxOn; if (sfxOn) sfx.ok(); return sfxOn; },
    toggleMus(songIfOn) { init(); musOn = !musOn; if (musOn && songIfOn) music(songIfOn); if (!musOn) music(null); return musOn; },
    /* compat com código antigo */
    set on(v) { sfxOn = v; }, get on() { return sfxOn; },
  };
})();
