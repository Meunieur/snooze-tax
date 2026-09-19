import React from 'react';
import { Flame, BellRing, Settings, Receipt } from 'lucide-react';
import { Currency } from '../types';

interface HeaderProps {
  totalPenaltyUSD: number;
  totalPenaltyVND: number;
  currency: Currency;
  onOpenLedger: () => void;
  onOpenSettings: () => void;
  onTriggerTestAlarm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalPenaltyUSD,
  totalPenaltyVND,
  currency,
  onOpenLedger,
  onOpenSettings,
  onTriggerTestAlarm
}) => {
  const displayPenalty =
    currency === 'USD'
      ? `$${totalPenaltyUSD.toFixed(2)}`
      : `${totalPenaltyVND.toLocaleString('vi-VN')} đ`;

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shadow-red-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                Snooze Tax
              </h1>
              <span className="text-[11px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                {currency === 'USD' ? '$5 / LẦN' : '50K / LẦN'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Báo Thức Quẹt Thẻ Ngủ Nướng</p>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Test Alarm button */}
          <button
            onClick={onTriggerTestAlarm}
            title="Thử chuông ngay để trải nghiệm"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Thử Kêu</span>
          </button>

          {/* Sổ Nợ / Thiệt Hại Button */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-bold transition-all"
            title="Xem Sổ nợ & Lịch sử quẹt thẻ"
          >
            <Receipt className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400 font-mono">{displayPenalty}</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all"
            title="Cài đặt"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
