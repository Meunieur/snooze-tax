import React, { useState } from 'react';
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
  Receipt,
  QrCode,
  Copy
} from 'lucide-react';
import { Currency, SnoozeRecord, UserStats } from '../types';
import { getEquivalentItem, getSlothTitle } from '../services/roastService';
import { generateVietQRUrl, OFFICIAL_DEVELOPER_BANK } from '../services/vietqr';
import { Language, TRANSLATIONS } from '../services/i18n';

interface DebtLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  records: SnoozeRecord[];
  currency: Currency;
  language: Language;
  onResetLedger: () => void;
}

export const DebtLedgerModal: React.FC<DebtLedgerModalProps> = ({
  isOpen,
  onClose,
  stats,
  records,
  currency,
  language,
  onResetLedger
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiedSTK, setCopiedSTK] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const totalPenalty = currency === 'USD' ? stats.totalPenaltyUSD : stats.totalPenaltyVND;
  const displayTotal =
    currency === 'USD'
      ? `$${totalPenalty.toFixed(2)}`
      : `${totalPenalty.toLocaleString('vi-VN')} đ`;

  const itemEquivalent = getEquivalentItem(totalPenalty, currency);
  const slothRank = getSlothTitle(stats.totalSnoozeCount);

  const transferAmount =
    currency === 'USD'
      ? Math.max(50000, totalPenalty * 25000)
      : Math.max(50000, totalPenalty);

  const qrUrl = generateVietQRUrl(
    OFFICIAL_DEVELOPER_BANK.bankBin,
    OFFICIAL_DEVELOPER_BANK.accountNumber,
    transferAmount,
    'Snooze Tax Penalty',
    OFFICIAL_DEVELOPER_BANK.accountName
  );

  const handleShareReceipt = () => {
    const text = language === 'vi'
      ? `Sổ nợ Snooze Tax của tôi:\n💳 Đã quẹt thẻ Apple Pay: ${displayTotal} cho ${stats.totalSnoozeCount} lần ngủ ráng!\n🏆 Danh hiệu: ${slothRank.title}\n🧋 Tương đương: ${itemEquivalent}\nBáo thức quẹt thẻ trị dứt điểm lười!`
      : `My Snooze Tax Debt Receipt:\n💳 Charged via Pay: ${displayTotal} across ${stats.totalSnoozeCount} snooze hits!\n🏆 Shame Title: ${slothRank.title}\n☕ Equivalent to: ${itemEquivalent}\nThe alarm clock that bills your laziness!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopySTK = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(OFFICIAL_DEVELOPER_BANK.accountNumber);
      setCopiedSTK(true);
      setTimeout(() => setCopiedSTK(false), 2000);
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
              <h2 className="text-base font-bold text-white">{t.ledger}</h2>
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

        {/* Big Total Hero Card */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-red-950/60 via-neutral-900 to-black border border-red-500/30 p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-24 h-24 text-red-500" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            {t.totalContributed}
          </span>

          <div className="text-5xl font-black font-mono tracking-tight text-white my-2 drop-shadow-md">
            {displayTotal}
          </div>

          <p className="text-[11px] text-neutral-400 mt-1 mb-2">
            {t.beneficiaryNotice}
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
              {t.equivalentTo}: <strong>{itemEquivalent}</strong>
            </span>
          </div>
        </div>

        {/* Action button: Pay real money to Admin */}
        <div className="mt-4">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQR ? t.hideQRBtn : t.qrDonateBtn}</span>
          </button>
        </div>

        {/* VietQR Popup Area */}
        {showQR && (
          <div className="mt-3 p-4 rounded-2xl bg-neutral-950 border border-emerald-500/40 text-center animate-fade-in">
            <p className="text-xs text-neutral-300 mb-2">
              {language === 'vi' ? 'Quét mã chuyển tiền thẳng vào tài khoản của Admin:' : 'Scan VietQR to transfer real cash to Admin:'}
            </p>
            <div className="bg-white p-2 rounded-2xl inline-block mx-auto mb-2 shadow-md">
              <img
                src={qrUrl}
                alt="VietQR Dev"
                className="w-48 h-48 object-contain rounded"
              />
            </div>
            <div className="text-[11px] text-neutral-400 space-y-1 mb-3">
              <p>Bank: <strong className="text-white">Techcombank</strong></p>
              <p>Account Name: <strong className="text-white">{OFFICIAL_DEVELOPER_BANK.accountName}</strong></p>
              <div className="flex items-center justify-center gap-1.5 font-mono text-emerald-400 font-bold">
                <span>Account Number: {OFFICIAL_DEVELOPER_BANK.accountNumber}</span>
                <button
                  onClick={handleCopySTK}
                  className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                  title="Copy"
                >
                  {copiedSTK ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-red-400">
              {stats.totalSnoozeCount}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              {t.timesSnoozed}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-emerald-400">
              {stats.totalOnTimeCount}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              {t.timesOnTime}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="text-xl font-mono font-black text-amber-400">
              {stats.currentStreak} {t.days}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold mt-0.5">
              {t.disciplineStreak}
            </div>
          </div>
        </div>

        {/* Transaction History Log */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              {t.recentTransactions} ({records.length})
            </h3>
          </div>

          {records.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-neutral-800/40 border border-neutral-800 text-neutral-400 text-xs">
              {t.noTransactions}
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {records.slice(-10).reverse().map((rec) => {
                const recDate = new Date(rec.timestamp).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
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
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold font-mono">
                          Pay
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
                <span className="text-emerald-400">{language === 'vi' ? 'Đã Copy Biên Lai!' : 'Copied Receipt!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>{t.shareReceipt}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (confirm(language === 'vi' ? 'Bệ hạ có chắc muốn xóa lịch sử quẹt thẻ không?' : 'Are you sure you want to reset all records?')) {
                onResetLedger();
              }
            }}
            className="py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 border border-red-500/30 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetLedger}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
