import { AlarmTone } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private alarmInterval: number | null = null;
  private isAlarmPlaying = false;
  private gainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playAlarm(tone: AlarmTone = 'digital', volume: number = 0.8) {
    this.stopAlarm();
    const ctx = this.initContext();
    this.isAlarmPlaying = true;

    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(Math.min(Math.max(volume, 0.1), 1), ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    const playCycle = () => {
      if (!this.isAlarmPlaying || !this.ctx || !this.gainNode) return;

      const now = this.ctx.currentTime;

      switch (tone) {
        case 'nuclear': {
          // Nuclear siren: rising and falling pitch
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.6);
          osc.frequency.linearRampToValueAtTime(450, now + 1.2);

          oscGain.gain.setValueAtTime(0.7, now);
          oscGain.gain.linearRampToValueAtTime(0.01, now + 1.25);

          osc.connect(oscGain);
          oscGain.connect(this.gainNode);

          osc.start(now);
          osc.stop(now + 1.25);
          break;
        }

        case 'airhorn': {
          // Airhorn style triple blast
          const freqs = [466.16, 622.25, 783.99]; // Bb4, Eb5, G5
          freqs.forEach((freq) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            // 3 quick blasts
            [0, 0.18, 0.36].forEach((offset) => {
              g.gain.setValueAtTime(0.4, now + offset);
              g.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.14);
            });

            osc.connect(g);
            g.connect(this.gainNode!);
            osc.start(now);
            osc.stop(now + 0.55);
          });
          break;
        }

        case 'retro': {
          // 8-bit fast arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            g.gain.setValueAtTime(0.3, now + idx * 0.12);
            g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.1);

            osc.connect(g);
            g.connect(this.gainNode!);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.12);
          });
          break;
        }

        case 'rooster': {
          // Cock-a-doodle-doo chirp synth
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
          osc.frequency.linearRampToValueAtTime(600, now + 0.7);

          g.gain.setValueAtTime(0.5, now);
          g.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

          osc.connect(g);
          g.connect(this.gainNode);
          osc.start(now);
          osc.stop(now + 0.8);
          break;
        }

        case 'digital':
        default: {
          // Classic beep beep beep
          [0, 0.15, 0.3, 0.45].forEach((t) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.5, now + t); // C6
            g.gain.setValueAtTime(0.5, now + t);
            g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.09);

            osc.connect(g);
            g.connect(this.gainNode!);
            osc.start(now + t);
            osc.stop(now + t + 0.1);
          });
          break;
        }
      }
    };

    // Trigger immediately then loop every 1.5s
    playCycle();
    this.alarmInterval = window.setInterval(playCycle, 1500);
  }

  public stopAlarm() {
    this.isAlarmPlaying = false;
    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  public playCashChing() {
    this.playApplePaySuccess();
  }

  public playApplePaySuccess() {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    // Tone 1
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    g1.gain.setValueAtTime(0.4, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2 (Signature high chime)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.12); // E6
    g2.gain.setValueAtTime(0.7, now + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.95);
  }

  public playCelebration() {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C major fanfare

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      g.gain.setValueAtTime(0.4, now + idx * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.7);
    });
  }

  public speakRoast(text: string, lang: 'vi' | 'en' = 'vi') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if TTS is not supported or blocked
    }
  }
}

export const soundEngine = new SoundEngine();
