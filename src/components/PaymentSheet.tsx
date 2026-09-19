import React, { useState } from 'react';
import { Check, CreditCard, ScanFace, Fingerprint, Bell, ShieldCheck, X } from 'lucide-react';
import { Currency } from '../types';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../services/haptics';

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fee: number;
  currency: Currency;
  beneficiaryName: string;
  onPaymentSuccess: () => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({
  isOpen,
  onClose,
  fee,
  currency,
  beneficiaryName,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bankNotification, setBankNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const feeDisplay =
    currency === 'USD'
      ? `$${fee.toFixed(2)}`
      : `${fee.toLocaleString('vi-VN')} đ`;

  const handleAuthorizePayment = () => {
    if (isProcessing || isSuccess) return;

    setIsProcessing(true);
    triggerHaptic('medium');

    // Simulate Face ID / Fingerprint verification for 0.8s
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      soundEngine.playApplePaySuccess();
      triggerHaptic('heavy');

      // Show mock bank transaction push notification
      setBankNotification(
        currency === 'USD'
          ? `Apple Card: Thanh toán -$${fee.toFixed(2)} tại Snooze Tax thành công.`
          : `MBBank: Thẻ Visa •••• 8868 vừa quẹt -${fee.toLocaleString('vi-VN')}đ tại SNOOZE TAX.`
      );

      // Auto finish and snooze alarm after 1.4s
      setTimeout(() => {
        onPaymentSuccess();
      }, 1400);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      {/* Mock Bank Push Notification Banner */}
      {bankNotification && (
        <div className="fixed top-4 left-4 right-4 sm:max-w-md sm:mx-auto z-50 p-3.5 rounded-2xl bg-neutral-900/95 border border-neutral-700 shadow-2xl backdrop-blur-xl flex items-start gap-3 animate-bounce-short">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] font-semibold">
              <span>BIẾN ĐỘNG SỐ DƯ THẺ</span>
              <span>Vừa xong</span>
            </div>
            <p className="text-white font-bold mt-0.5">{bankNotification}</p>
          </div>
        </div>
      )}

      {/* Payment Bottom Sheet */}
      <div className="w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl bg-neutral-900 border-t sm:border border-neutral-800 shadow-2xl p-6 text-white animate-slide-up">
        {/* Top Handle & Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-1.5 font-bold text-base tracking-tight">
            <span className="text-xl"></span>
            <span>Pay</span>
            <span className="text-xs font-normal text-neutral-400 ml-1">/ Google Pay</span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing || isSuccess}
            className="p-1 text-neutral-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Payment Summary */}
        <div className="text-center py-5">
          <span className="text-[11px] uppercase tracking-widest text-red-400 font-bold block mb-1">
            Thanh Toán Mua 5 Phút Ngủ Thêm
          </span>
          <div className="text-5xl font-black font-mono tracking-tight text-white my-1">
            {feeDisplay}
          </div>
          <p className="text-xs text-neutral-400">
            Thụ hưởng: <strong className="text-neutral-200">{beneficiaryName}</strong>
          </p>
        </div>

        {/* Selected Card Info */}
        <div className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-between text-xs mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-inner">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Apple Card / Visa</span>
                <span className="text-[10px] text-neutral-400 font-mono">•••• 8868</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Xác thực bảo mật sinh trắc học
              </p>
            </div>
          </div>
        </div>

        {/* Biometric Scan Action Area */}
        <div className="text-center">
          {!isSuccess ? (
            <button
              onClick={handleAuthorizePayment}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-95 ${
                isProcessing
                  ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200 shadow-white/10'
              }`}
            >
              {isProcessing ? (
                <>
                  <ScanFace className="w-5 h-5 animate-pulse text-sky-500" />
                  <span>Đang quét Face ID khuôn mặt ngái ngủ...</span>
                </>
              ) : (
                <>
                  <ScanFace className="w-5 h-5 text-black" />
                  <span>Xác Nhận Face ID Quẹt {feeDisplay}</span>
                </>
              )}
            </button>
          ) : (
            <div className="py-4 px-6 rounded-2xl bg-emerald-500 text-black font-extrabold text-base flex items-center justify-center gap-2 animate-bounce-short">
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Thanh Toán Thành Công! Đang cho ngủ...</span>
            </div>
          )}

          <p className="text-[10px] text-neutral-500 mt-3 flex items-center justify-center gap-1">
            <Fingerprint className="w-3 h-3" />
            <span>Chạm xác thực 1 giây để chuông tắt và được ngủ tiếp</span>
          </p>
        </div>
      </div>
    </div>
  );
};
