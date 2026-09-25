import React from 'react';
import { Flame, BellRing, Settings, Receipt, Globe } from 'lucide-react';
import { Currency } from '../types';
import { Language, TRANSLATIONS } from '../services/i18n';

interface HeaderProps {
  totalPenaltyUSD: number;
  totalPenaltyVND: number;
  currency: Currency;
  language: Language;
  onToggleLanguage: () => void;
  onOpenLedger: () => void;
  onOpenSettings: () => void;
  onTriggerTestAlarm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalPenaltyUSD,
  totalPenaltyVND,
  currency,
  language,
  onToggleLanguage,
  onOpenLedger,
  onOpenSettings,
  onTriggerTestAlarm
}) => {
  const t = TRANSLATIONS[language];
  const isUSD = currency === 'USD';
  const EXCHANGE_RATE = 25000;
  const totalInSelectedCurrency = isUSD
    ? totalPenaltyUSD + (totalPenaltyVND / EXCHANGE_RATE)
    : totalPenaltyVND + (totalPenaltyUSD * EXCHANGE_RATE);

  const displayPenalty = isUSD
    ? `$${totalInSelectedCurrency.toFixed(2)}`
    : `${Math.round(totalInSelectedCurrency).toLocaleString('vi-VN')} đ`;

  return (
    <header className="sticky top-0 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shadow-red-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                {t.appTitle}
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-mono">
                {currency === 'USD' ? '$5 / SNOOZE' : '50K / LẦN'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px] font-bold transition-all active:scale-95"
            title="Switch Language (EN / VI)"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Quick Test Alarm button */}
          <button
            onClick={onTriggerTestAlarm}
            title={t.testAlarm}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.testAlarm}</span>
          </button>

          {/* Sổ Nợ / Thiệt Hại Button */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-bold transition-all"
            title={t.ledger}
          >
            <Receipt className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400 font-mono">{displayPenalty}</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
