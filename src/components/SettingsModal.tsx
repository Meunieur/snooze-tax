import React from 'react';
import {
  X,
  Settings,
  Volume2,
  Smartphone,
  Check,
  Mic,
  Building2,
  Globe
} from 'lucide-react';
import { AppSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';

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

  const t = TRANSLATIONS[localSettings.language];

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
              <h2 className="text-base font-bold text-white">{t.settings}</h2>
              <p className="text-xs text-neutral-400">{t.appSubtitle}</p>
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
          {/* Language Selection */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Language / Ngôn Ngữ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, language: 'en', currency: 'USD' })}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  localSettings.language === 'en'
                    ? 'bg-red-500 text-white border-red-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                English (Global USD)
              </button>
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, language: 'vi', currency: 'VND' })}
                className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                  localSettings.language === 'vi'
                    ? 'bg-red-500 text-white border-red-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                Tiếng Việt (VND)
              </button>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              {t.currencyDefault}
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
                USD ($) — $5 / Snooze
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

          {/* Publisher Beneficiary Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                {t.publisherNoticeHeader}
              </span>
            </div>
            <p className="text-white font-extrabold text-xs">
              Snooze Tax Inc.
            </p>
            <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
              {t.publisherNoticeDesc}
            </p>
          </div>

          {/* Volume Slider */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" /> {t.volume}
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
                <p className="font-bold text-white">{t.voiceRoast}</p>
                <p className="text-[11px] text-neutral-400">
                  {t.voiceRoastDesc}
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

          {/* App Platform & Privacy Policy */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                {localSettings.language === 'vi' ? 'Thông Tin & Hướng Dẫn' : 'App Info & Guide'}
              </span>
              <button
                type="button"
                onClick={() => setShowInstallGuide(!showInstallGuide)}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                {showInstallGuide ? (localSettings.language === 'vi' ? 'Ẩn' : 'Hide') : (localSettings.language === 'vi' ? 'Xem' : 'Guide')}
              </button>
            </div>

            {showInstallGuide && (
              <div className="pt-2 border-t border-neutral-800 space-y-2 text-[11px] text-neutral-300">
                <div className="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                  <strong className="text-white">📱 iPhone / iPad (iOS):</strong>
                  <p className="text-neutral-400 mt-0.5">
                    Safari ➔ Share ➔ <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                  <strong className="text-white">🤖 Android:</strong>
                  <p className="text-neutral-400 mt-0.5">
                    Tải từ Google Play Store hoặc Chrome ➔ <strong>"Install app"</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <a
                href="/privacy.html"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1"
              >
                {localSettings.language === 'vi' ? 'Chính sách quyền riêng tư (Privacy)' : 'Privacy Policy'}
              </a>
              <span>v1.0.0 (Google Play Ready)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
