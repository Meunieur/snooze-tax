import React from 'react';
import {
  X,
  Settings,
  Volume2,
  Smartphone,
  Check,
  Mic,
  Building2
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);
  const [showInstallGuide, setShowInstallGuide] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center border border-neutral-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cài Đặt Hệ Thống</h2>
              <p className="text-xs text-neutral-400">Tùy biến tiền phạt & trải nghiệm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          {/* Currency Selection */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Đơn Vị Tiền Tệ Mặc Định
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, currency: 'USD' })}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  localSettings.currency === 'USD'
                    ? 'bg-red-500 text-white border-red-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                USD ($) — $5 / Lần
              </button>
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, currency: 'VND' })}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  localSettings.currency === 'VND'
                    ? 'bg-red-500 text-white border-red-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                VND (đ) — 50.000đ / Lần
              </button>
            </div>
          </div>

          {/* Publisher Beneficiary Notice (Hài hước chuẩn Meme) */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                Đơn Vị Thụ Hưởng Tiền Phạt
              </span>
            </div>
            <p className="text-white font-extrabold text-xs">
              Snooze Tax Inc. (Nhà Phát Hành Ứng Dụng)
            </p>
            <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
              Mỗi lần Bệ hạ bấm hoãn chuông 5 phút, $5 sẽ được thanh toán trực tiếp cho Nhà phát hành để tài trợ cà phê và làm giàu cho lập trình viên!
            </p>
          </div>

          {/* Volume Slider */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" /> Âm Lượng Báo Thức
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round(localSettings.soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={localSettings.soundVolume}
              onChange={e =>
                setLocalSettings({ ...localSettings, soundVolume: parseFloat(e.target.value) })
              }
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          {/* Voice Audio Roast Toggle */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-400" />
              <div>
                <p className="font-bold text-white">Giọng Nói Châm Biếm (TTS Voice)</p>
                <p className="text-[11px] text-neutral-400">
                  Phát âm thanh cảm ơn đã tài trợ tiền cho app mỗi khi Snooze
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.voiceAudioRoast}
                onChange={e =>
                  setLocalSettings({ ...localSettings, voiceAudioRoast: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* App Platform & Native Installation Info */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                Cài Đặt Cho iOS & Android
              </span>
              <button
                type="button"
                onClick={() => setShowInstallGuide(!showInstallGuide)}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                {showInstallGuide ? 'Ẩn' : 'Xem'}
              </button>
            </div>

            {showInstallGuide && (
              <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2 text-[11px] text-neutral-300">
                <div className="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                  <strong className="text-white">📱 iPhone / iPad (iOS):</strong>
                  <p className="text-neutral-400 mt-0.5">
                    Mở Safari ➔ Bấm Share ➔ Chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                  </p>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                  <strong className="text-white">🤖 Điện thoại Android:</strong>
                  <p className="text-neutral-400 mt-0.5">
                    Mở Chrome ➔ Menu 3 chấm ➔ Chọn <strong>"Cài đặt ứng dụng"</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
