import { AlarmTone } from '../types';
import { ROAST_MESSAGES_EN } from './roastService';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private alarmInterval: number | null = null;
  private isAlarmPlaying = false;
  private gainNode: GainNode | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

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
          const freqs = [466.16, 622.25, 783.99];
          freqs.forEach((freq) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

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
          const notes = [523.25, 659.25, 783.99, 1046.5];
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
          [0, 0.15, 0.3, 0.45].forEach((t) => {
            const osc = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.5, now + t);
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

  public playApplePaySuccess() {
    const ctx = this.initContext();
    const now = ctx.currentTime;

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
    const chords = [523.25, 659.25, 783.99, 1046.5];

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

  public speakRoast(text: string, requestedLang: 'vi' | 'en' = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      if (!this.cachedVoices || this.cachedVoices.length === 0) {
        this.cachedVoices = window.speechSynthesis.getVoices();
      }

      let chosenVoice: SpeechSynthesisVoice | null = null;
      let textToRead = text;
      let targetLang = requestedLang === 'vi' ? 'vi-VN' : 'en-US';

      if (requestedLang === 'vi') {
        const viVoice = this.cachedVoices.find(v => v.lang.toLowerCase().startsWith('vi'));
        if (viVoice) {
          chosenVoice = viVoice;
        } else {
          // Fallback: If device has no Vietnamese TTS voice installed,
          // do NOT read Vietnamese using English voice (which causes severe mispronunciation).
          // Instead, speak a sharp English roast with native English voice!
          targetLang = 'en-US';
          textToRead = ROAST_MESSAGES_EN[Math.floor(Math.random() * ROAST_MESSAGES_EN.length)];
          chosenVoice = this.cachedVoices.find(v => v.lang.toLowerCase().startsWith('en')) || null;
        }
      } else {
        chosenVoice = this.cachedVoices.find(v => v.lang.toLowerCase().startsWith('en')) || null;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = targetLang;
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if TTS is blocked
    }
  }
}

export const soundEngine = new SoundEngine();
