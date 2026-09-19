import React from 'react';
import {
  X,
  CreditCard,
  TrendingDown,
  Award,
  Coffee,
  RotateCcw,
  Calendar,
  Share2,
  Check,
  Receipt
} from 'lucide-react';
import { Currency, SnoozeRecord, UserStats } from '../types';
import { getEquivalentItem, getSlothTitle } from '../services/roastService';

interface DebtLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  records: SnoozeRecord[];
  currency: Currency;
  onResetLedger: () => void;
}

export const DebtLedgerModal: React.FC<DebtLedgerModalProps> = ({
  isOpen,
  onClose,
  stats,
  records,
  currency,
  onResetLedger
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const totalPenalty = currency === 'USD' ? stats.totalPenaltyUSD : stats.totalPenaltyVND;
  const displayTotal =
    currency === 'USD'
      ? `$${totalPenalty.toFixed(2)}`
      : `${totalPenalty.toLocaleString('vi-VN')} đ`;

  const itemEquivalent = getEquivalentItem(totalPenalty, currency);
  const slothRank = getSlothTitle(stats.totalSnoozeCount);

  const handleShareReceipt = () => {
    const text = `Sổ nợ Snooze Tax của tôi:\n💳 Đã quẹt thẻ Apple Pay: ${displayTotal} cho ${stats.totalSnoozeCount} lần ngủ ráng!\n🏆 Danh hiệu: ${slothRank.title}\n🧋 Tương đương: ${itemEquivalent}\nBáo thức quẹt thẻ trị dứt điểm lười!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sổ Nợ & Thiệt Hại Quẹt Thẻ</h2>
              <p className="text-xs text-neutral-400">Thống kê số tiền đã quẹt Apple Pay để ngủ ráng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Total Hero Card */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-red-950/60 via-neutral-900 to-black border border-red-500/30 p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-24 h-24 text-red-500" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Tổng Tiền Đã Cúng Cho Nhà Phát Hành App
          </span>

          <div className="text-5xl font-black font-mono tracking-tight text-white my-2 drop-shadow-md">
            {displayTotal}
          </div>

          <p className="text-[11px] text-neutral-400 mt-1 mb-2">
            Đơn vị thụ hưởng: <strong className="text-amber-400">Snooze Tax Inc.</strong> (Tiệm Bán Giấc Ngủ)
          </p>

          {/* Sloth Rank Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-800/90 border border-neutral-700 text-xs font-bold my-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span className={slothRank.color}>{slothRank.title}</span>
            <span className="text-neutral-400">({slothRank.badge})</span>
          </div>

          {/* Equivalent Item Fun Comparison */}
          <div className="mt-3 pt-3 border-t border-red-500/20 flex items-center justify-center gap-2 text-xs text-amber-300">
            <Coffee className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Số tiền này tương đương: <strong>{itemEquivalent}</strong>
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-red-400">
              {stats.totalSnoozeCount}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              Lần Quẹt Snooze
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-emerald-400">
              {stats.totalOnTimeCount}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              Dậy Đúng Giờ
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-amber-400">
              {stats.currentStreak} ngày
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              Chuỗi Kỷ Luật
            </div>
          </div>
        </div>

        {/* Transaction History Log */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Lịch Sử Giao Dịch Gần Đây ({records.length})
            </h3>
          </div>

          {records.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-neutral-800/40 border border-neutral-800 text-neutral-400 text-xs">
              Chưa có lần quẹt thẻ nào! Bệ hạ đang giữ kỷ luật cực tốt.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {records.slice(-10).reverse().map((rec) => {
                const recDate = new Date(rec.timestamp).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const feeText =
                  rec.currency === 'USD'
                    ? `-$${rec.fee.toFixed(2)}`
                    : `-${(rec.fee / 1000).toFixed(0)}k đ`;

                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                        <span>{rec.alarmLabel}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                          Apple Pay
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 italic mt-0.5">
                        "{rec.roastMessage}"
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{recDate}</span>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-red-400 text-sm whitespace-nowrap">
                      {feeText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex gap-2">
          <button
            onClick={handleShareReceipt}
            className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Đã Copy Biên Lai!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Khoe Biên Lai (Copy)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('Bệ hạ có chắc muốn xóa lịch sử quẹt thẻ không?')) {
                onResetLedger();
              }
            }}
            className="py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 border border-red-500/30 transition-all"
            title="Xóa lịch sử"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm Lại Cuộc Đời</span>
          </button>
        </div>
      </div>
    </div>
  );
};
