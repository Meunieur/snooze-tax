export interface BankOption {
  bin: string;
  shortName: string;
  name: string;
}

export const OFFICIAL_DEVELOPER_BANK = {
  bankName: 'Techcombank',
  bankBin: '970407',
  accountNumber: '19033832346019',
  accountName: 'TRAN MINH TRI'
};

export const POPULAR_VIETNAMESE_BANKS: BankOption[] = [
  { bin: '970407', shortName: 'Techcombank', name: 'Kỹ thương Việt Nam' },
  { bin: '970422', shortName: 'MBBank', name: 'Ngân hàng Quân Đội' },
  { bin: '970436', shortName: 'Vietcombank', name: 'Ngoại thương Việt Nam' },
  { bin: '970432', shortName: 'VPBank', name: 'Việt Nam Thịnh Vượng' },
  { bin: '970416', shortName: 'ACB', name: 'Á Châu' },
  { bin: '970418', shortName: 'BIDV', name: 'Đầu tư và Phát triển VN' },
  { bin: '970423', shortName: 'TPBank', name: 'Tiên Phong' },
  { bin: '970405', shortName: 'Agribank', name: 'Nông nghiệp & PT Nông thôn' },
  { bin: '970415', shortName: 'VietinBank', name: 'Công Thương Việt Nam' }
];

export const generateVietQRUrl = (
  bankBin: string = OFFICIAL_DEVELOPER_BANK.bankBin,
  accountNo: string = OFFICIAL_DEVELOPER_BANK.accountNumber,
  amount: number = 50000,
  content: string = 'Snooze Tax Tien Ngu Nuong',
  accountName: string = OFFICIAL_DEVELOPER_BANK.accountName
): string => {
  const cleanAccount = accountNo.replace(/\s+/g, '');
  const encodedContent = encodeURIComponent(content || 'Snooze Tax Tien Ngu Nuong');
  const encodedName = accountName ? `&accountName=${encodeURIComponent(accountName)}` : '';
  return `https://img.vietqr.io/image/${bankBin}-${cleanAccount}-compact2.png?amount=${Math.round(amount)}&addInfo=${encodedContent}${encodedName}`;
};
