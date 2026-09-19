import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Bell,
  CheckCircle2,
  Volume2,
  VolumeX,
  ShieldCheck
} from 'lucide-react';
import { Alarm, AppSettings } from '../types';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../services/haptics';
import { getRoastMessage } from '../services/roastService';
import { PaymentSheet } from './PaymentSheet';

interface ActiveAlarmOverlayProps {
  alarm: Alarm;
  settings: AppSettings;
  onWakeUpSuccess: (alarm: Alarm) => void;
  onSnoozeConfirmed: (alarm: Alarm, roastMsg: string) => void;
}

export const ActiveAlarmOverlay: React.FC<ActiveAlarmOverlayProps> = ({
  alarm,
  settings,
  onWakeUpSuccess,
  onSnoozeConfirmed
}) => {
  const [sessionSnoozeCount, setSessionSnoozeCount] = useState(0);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMathPrompt, setShowMathPrompt] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState(false);

  // Generate random math problem if enabled
  const mathProblem = useMemo(() => {
    const a = Math.floor(Math.random() * 35) + 12;
    const b = Math.floor(Math.random() * 35) + 8;
    return { a, b, answer: a + b };
  }, []);

  // Play alarm sound continuously when overlay mounts
  useEffect(() => {
    if (!isMuted) {
      soundEngine.playAlarm(alarm.soundTone, settings.soundVolume);
    }
    triggerHaptic('heavy');

    const hapticInterval = setInterval(() => {
      triggerHaptic('warning');
    }, 2000);

    return () => {
      clearInterval(hapticInterval);
      soundEngine.stopAlarm();
    };
  }, [alarm.soundTone, settings.soundVolume, isMuted]);

  const feeDisplay =
    alarm.currency === 'USD'
      ? `$${alarm.snoozeFee.toFixed(2)}`
      : `${alarm.snoozeFee.toLocaleString('vi-VN')} đ`;

  // Snooze Pay Button Clicked ➔ Opens Apple Pay / Google Pay Sheet!
  const handleOpenPaymentSheet = () => {
    triggerHaptic('medium');
    setIsPaymentSheetOpen(true);
  };

  // Called when Apple Pay / Face ID succeeds
  const handlePaymentSuccess = () => {
    setIsPaymentSheetOpen(false);
    soundEngine.stopAlarm();

    const newCount = sessionSnoozeCount + 1;
    setSessionSnoozeCount(newCount);

    const roast = getRoastMessage(settings.language, newCount, alarm.snoozeFee, alarm.currency);

    if (settings.voiceAudioRoast) {
      setTimeout(() => {
        soundEngine.speakRoast(roast, settings.language);
      }, 300);
    }

    onSnoozeConfirmed(alarm, roast);
  };

  // Handle Wake Up Clicked
  const handleWakeUpClick = () => {
    if (alarm.mathChallenge) {
      setShowMathPrompt(true);
      triggerHaptic('light');
    } else {
      executeWakeUp();
    }
  };

  const verifyMathAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer.trim(), 10) === mathProblem.answer) {
      executeWakeUp();
    } else {
      setMathError(true);
      triggerHaptic('error');
      setTimeout(() => setMathError(false), 1200);
      setMathAnswer('');
    }
  };

  const executeWakeUp = () => {
    soundEngine.stopAlarm();
    soundEngine.playCelebration();
    triggerHaptic('heavy');

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    onWakeUpSuccess(alarm);
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.playAlarm(alarm.soundTone, settings.soundVolume);
      setIsMuted(false);
    } else {
      soundEngine.stopAlarm();
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-black text-white select-none overflow-hidden">
      {/* Top Bar: Minimal Status & Mute */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1" />
          <span>Báo thức đang reo</span>
        </div>

        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title={isMuted ? 'Bật chuông' : 'Tắt tiếng tạm thời'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* Center Main Stage: Clean, Focused, Dramatic */}
      <div className="my-auto flex flex-col items-center text-center max-w-sm w-full">
        {/* Ringing Bell Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-red-600/20 blur-3xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
            <Bell className="w-12 h-12 text-red-500 animate-shake" />
          </div>
        </div>

        {/* Big Time */}
        <div className="font-mono text-7xl sm:text-8xl font-black tracking-tight text-white mb-2 drop-shadow-md">
          {alarm.time}
        </div>

        {/* Alarm Label */}
        <p className="text-base font-medium text-neutral-300 mb-6 px-4 line-clamp-2">
          {alarm.label}
        </p>

        {/* HUGE EMPHASIS: THE SNOOZE TAX PRICE */}
        <div className="w-full py-4 px-5 rounded-3xl bg-red-950/40 border border-red-500/30 shadow-2xl backdrop-blur-md mb-2">
          <span className="text-xs uppercase tracking-widest text-red-400 font-bold block mb-1">
            GIÁ CHUỘC GIẤC NGỦ
          </span>
          <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight my-1">
            {feeDisplay} <span className="text-xl text-neutral-400 font-normal">/ Lần</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Quẹt thẻ Apple Pay / Google Pay tức thì để ngủ thêm 5 phút
          </p>
        </div>

        {sessionSnoozeCount > 0 && (
          <p className="text-xs font-semibold text-rose-400 mt-2">
            Đã quẹt sáng nay: {sessionSnoozeCount} lần (-{alarm.currency === 'USD' ? `$${(sessionSnoozeCount * alarm.snoozeFee).toFixed(2)}` : `${(sessionSnoozeCount * alarm.snoozeFee).toLocaleString('vi-VN')} đ`})
          </p>
        )}
      </div>

      {/* Bottom Actions: Clear & High-Contrast */}
      <div className="w-full max-w-sm space-y-3 pb-4">
        {/* SNOOZE PAY BUTTON (Apple Pay / Google Pay Face ID) */}
        <button
          onClick={handleOpenPaymentSheet}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-lg tracking-wide shadow-2xl shadow-red-600/40 border-2 border-red-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-2xl font-normal leading-none"></span>
          <span>SNOOZE (-{feeDisplay})</span>
        </button>

        {/* FREE Wake Up Button */}
        <button
          onClick={handleWakeUpClick}
          className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-sm tracking-wide border border-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>THỨC DẬY NGAY (MIỄN PHÍ)</span>
        </button>
      </div>

      {/* Biometric Apple Pay / Google Pay Sheet */}
      <PaymentSheet
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        fee={alarm.snoozeFee}
        currency={alarm.currency}
        beneficiaryName="Snooze Tax Inc. (Nhà Phát Hành)"
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Modal: Math Challenge to prove awake */}
      {showMathPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xs rounded-3xl bg-neutral-900 border border-neutral-700 p-6 text-center shadow-2xl animate-shake">
            <ShieldCheck className="w-10 h-10 text-sky-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Kiểm Tra Tỉnh Táo</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Giải phép tính này để tắt chuông miễn phí:
            </p>

            <div className="text-3xl font-mono font-black text-amber-400 mb-4 bg-neutral-800 py-3 rounded-2xl border border-neutral-700">
              {mathProblem.a} + {mathProblem.b} = ?
            </div>

            <form onSubmit={verifyMathAnswer} className="space-y-3">
              <input
                type="number"
                autoFocus
                value={mathAnswer}
                onChange={e => setMathAnswer(e.target.value)}
                placeholder="Kết quả..."
                className={`w-full text-center font-mono text-2xl font-bold py-2.5 rounded-xl bg-neutral-800 border-2 text-white outline-none ${
                  mathError ? 'border-red-500 animate-shake' : 'border-neutral-700'
                }`}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMathPrompt(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Xác Nhận Dậy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
