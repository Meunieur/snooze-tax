export interface BankOption {
  bin: string;
  shortName: string;
  name: string;
}

export const POPULAR_VIETNAMESE_BANKS: BankOption[] = [
  { bin: '970422', shortName: 'MBBank', name: 'Ngân hàng Quân Đội' },
  { bin: '970436', shortName: 'Vietcombank', name: 'Ngoại thương Việt Nam' },
  { bin: '970407', shortName: 'Techcombank', name: 'Kỹ thương Việt Nam' },
  { bin: '970432', shortName: 'VPBank', name: 'Việt Nam Thịnh Vượng' },
  { bin: '970416', shortName: 'ACB', name: 'Á Châu' },
  { bin: '970418', shortName: 'BIDV', name: 'Đầu tư và Phát triển VN' },
  { bin: '970423', shortName: 'TPBank', name: 'Tiên Phong' },
  { bin: '970405', shortName: 'Agribank', name: 'Nông nghiệp & PT Nông thôn' },
  { bin: '970415', shortName: 'VietinBank', name: 'Công Thương Việt Nam' }
];

export const generateVietQRUrl = (
  bankBin: string,
  accountNo: string,
  amount: number,
  content: string,
  accountName?: string
): string => {
  if (!accountNo || !bankBin) return '';
  const cleanAccount = accountNo.replace(/\s+/g, '');
  const encodedContent = encodeURIComponent(content || 'Tien phat ngu nuong');
  const encodedName = accountName ? `&accountName=${encodeURIComponent(accountName)}` : '';
  return `https://img.vietqr.io/image/${bankBin}-${cleanAccount}-compact2.png?amount=${Math.round(amount)}&addInfo=${encodedContent}${encodedName}`;
};
