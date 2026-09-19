import React, { useState } from 'react';
import { X, Volume2, Play, DollarSign, Calculator, Check } from 'lucide-react';
import { Alarm, AlarmTone, Currency } from '../types';
import { soundEngine } from '../services/soundEngine';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarm: Omit<Alarm, 'id' | 'snoozeCount'>, editingId?: string) => void;
  editingAlarm?: Alarm | null;
  defaultCurrency: Currency;
}

const TONES: { id: AlarmTone; name: string; desc: string }[] = [
  { id: 'digital', name: 'Điện tử cổ điển', desc: 'Beep beep dồn dập' },
  { id: 'nuclear', name: 'Còi báo động hạt nhân', desc: 'Hú giật mình thon thót' },
  { id: 'airhorn', name: 'Kèn xung trận Airhorn', desc: 'Náo loạn cả xóm' },
  { id: 'rooster', name: 'Gà trống công nghệ', desc: 'Tiếng gáy vang dội' },
  { id: 'retro', name: '8-Bit Arcade Game', desc: 'Giai điệu game retro 8-bit' }
];

const PRESET_FEES_USD = [1, 2, 5, 10, 20];
const PRESET_FEES_VND = [20000, 50000, 100000, 200000];
const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAlarm,
  defaultCurrency
}) => {
  const [time, setTime] = useState(editingAlarm?.time || '07:00');
  const [label, setLabel] = useState(editingAlarm?.label || 'Dậy đi làm làm giàu!');
  const [currency, setCurrency] = useState<Currency>(editingAlarm?.currency || defaultCurrency);
  const [snoozeFee, setSnoozeFee] = useState<number>(
    editingAlarm?.snoozeFee || (currency === 'USD' ? 5 : 50000)
  );
  const [days, setDays] = useState<number[]>(editingAlarm?.days || [1, 2, 3, 4, 5]);
  const [soundTone, setSoundTone] = useState<AlarmTone>(editingAlarm?.soundTone || 'digital');
  const [mathChallenge, setMathChallenge] = useState<boolean>(editingAlarm?.mathChallenge ?? true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    if (days.includes(dayIndex)) {
      setDays(days.filter(d => d !== dayIndex));
    } else {
      setDays([...days, dayIndex].sort());
    }
  };

  const handlePreviewTone = (tone: AlarmTone) => {
    soundEngine.stopAlarm();
    setIsPlayingPreview(true);
    soundEngine.playAlarm(tone, 0.7);
    setTimeout(() => {
      soundEngine.stopAlarm();
      setIsPlayingPreview(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.stopAlarm();
    onSave(
      {
        time,
        label,
        enabled: true,
        days,
        snoozeFee,
        currency,
        soundTone,
        mathChallenge
      },
      editingAlarm?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 text-neutral-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">
              {editingAlarm ? 'Chỉnh Sửa Báo Thức' : 'Thêm Báo Thức Mới'}
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.stopAlarm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Giờ Báo Thức
            </label>
            <div className="flex justify-center">
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="bg-neutral-800 border border-neutral-700 focus:border-red-500 rounded-2xl px-6 py-3 text-4xl font-mono font-black text-center text-white tracking-widest outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Lý Do Phải Dậy
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="VD: Dậy đi họp kẻo sếp trừ lương..."
              className="w-full bg-neutral-800 border border-neutral-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          {/* Snooze Tax Rate - ENLARGED */}
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Mức Phạt Quẹt Thẻ / Snooze
              </span>
              <div className="flex bg-neutral-800 rounded-lg p-0.5 border border-neutral-700 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('USD');
                    setSnoozeFee(5);
                  }}
                  className={`px-2 py-0.5 rounded font-semibold transition-all ${
                    currency === 'USD' ? 'bg-red-500 text-white' : 'text-neutral-400'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('VND');
                    setSnoozeFee(50000);
                  }}
                  className={`px-2 py-0.5 rounded font-semibold transition-all ${
                    currency === 'VND' ? 'bg-red-500 text-white' : 'text-neutral-400'
                  }`}
                >
                  VND (đ)
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-300 mb-3">
              Mỗi lần Bệ hạ bấm hoãn chuông 5 phút, thẻ Apple Pay sẽ quẹt trừ ngay số tiền này cho Nhà phát hành!
            </p>

            {/* Presets Chips */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {(currency === 'USD' ? PRESET_FEES_USD : PRESET_FEES_VND).map(fee => (
                <button
                  key={fee}
                  type="button"
                  onClick={() => setSnoozeFee(fee)}
                  className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center ${
                    snoozeFee === fee
                      ? 'bg-red-500 text-white border-red-400 shadow-md scale-105'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  {currency === 'USD' ? `$${fee}` : `${(fee / 1000).toFixed(0)}k đ`}
                </button>
              ))}
            </div>
          </div>

          {/* Repeat Days */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Lặp Lại Hàng Tuần
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAY_LABELS.map((dayLabel, index) => {
                const isSelected = days.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Tone Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Nhạc Chuông Báo Thức
              </label>
              {isPlayingPreview && (
                <span className="text-xs text-amber-400 animate-pulse flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Đang phát...
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TONES.map(tone => (
                <div
                  key={tone.id}
                  onClick={() => setSoundTone(tone.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    soundTone === tone.id
                      ? 'bg-neutral-800 border-amber-500 text-white'
                      : 'bg-neutral-800/50 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        soundTone === tone.id
                          ? 'border-amber-400 bg-amber-400'
                          : 'border-neutral-500'
                      }`}
                    >
                      {soundTone === tone.id && <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{tone.name}</p>
                      <p className="text-[10px] text-neutral-400">{tone.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handlePreviewTone(tone.id);
                    }}
                    className="p-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-amber-400 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Math Challenge Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Thử Thách Giải Toán Để Tắt</p>
                <p className="text-[10px] text-neutral-400">
                  Giải 1 phép tính mới được tắt chuông miễn phí
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mathChallenge}
                onChange={e => setMathChallenge(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.stopAlarm();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu Báo Thức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
