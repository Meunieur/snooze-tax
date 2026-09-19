import { Currency } from '../types';

export const ROAST_MESSAGES_VI = [
  "Cảm ơn Bệ hạ đã hào phóng cúng $5 cho nhà phát hành app để ngủ tiếp!",
  "Chúc mừng! Đội ngũ lập trình viên vừa được bạn mời thêm một ly cà phê xịn.",
  "Quẹt thẻ thành công! Tiền đã vào túi dev, chúc bạn tiếp tục ngáy khò khò.",
  "Bấm Snooze nhanh như chớp! Đúng là người giàu, $5 với bạn chỉ là hạt cát.",
  "Báo thức: 'Đã nhận $5, hợp đồng ngủ thêm 5 phút bắt đầu có hiệu lực!'",
  "Bạn vừa mua 5 phút ngủ với mức giá đắt ngang khách sạn 5 sao Dubai.",
  "Cứ đà ngủ này thì bạn sắp nuôi sống cả công ty làm app báo thức rồi đấy!",
  "Ngủ thêm 5 phút không giúp bạn trẻ ra, nhưng chắc chắn làm nhà phát hành giàu lên.",
  "Thôi dậy đi đại gia ơi, tiền quẹt thẻ nãy giờ đủ mua cổ phần công ty rồi!",
  "Chiếc giường này rất êm ái, và hóa đơn Apple Pay thì cực kỳ thực tế."
];

export const ROAST_MESSAGES_EN = [
  "Cha-ching! 5 more minutes of sleep just cost you a fancy coffee.",
  "You snooze, you literally lose. Your bank balance just shed tears!",
  "Congratulations, you are officially the most expensive sleeper in town.",
  "Paid in full! Sweet dreams sponsored by your poor wallet.",
  "Sleep is free, but snoozing is a luxury subscription only you can afford.",
  "Another $5 into the sloth fund. Your future self is judging you.",
  "That snooze button is the most profitable scam in history!",
  "Keep hitting snooze and you'll have to mortgage your bed."
];

export const getRoastMessage = (lang: 'vi' | 'en', snoozeCount: number, fee: number, currency: Currency): string => {
  const list = lang === 'vi' ? ROAST_MESSAGES_VI : ROAST_MESSAGES_EN;
  const randomIndex = Math.floor(Math.random() * list.length);
  const base = list[randomIndex];

  if (snoozeCount >= 3) {
    if (lang === 'vi') {
      return `Lần bấm thứ ${snoozeCount} rồi! Bạn đã nướng tổng cộng ${snoozeCount * fee} ${currency === 'VND' ? 'đ' : '$'}. Dậy ngay kẻo nghèo!`;
    } else {
      return `Snooze #${snoozeCount}! You have literally burned ${snoozeCount * fee} ${currency}. Get out of bed now!`;
    }
  }

  return base;
};

export const getEquivalentItem = (totalAmount: number, currency: Currency): string => {
  if (currency === 'USD') {
    if (totalAmount < 10) return "1 ly Starbucks Caffe Latte";
    if (totalAmount < 30) return "1 bữa pizza hải sản cỡ lớn";
    if (totalAmount < 70) return "1 chiếc tai nghe không dây xịn";
    if (totalAmount < 150) return "1 đôi giày Nike Air Force";
    return "1 chiếc Apple Watch";
  } else {
    // VND
    if (totalAmount < 50000) return "1 bát phở bò tái lăn nóng hổi";
    if (totalAmount < 120000) return "2 ly trà sữa nướng trân châu";
    if (totalAmount < 300000) return "1 bữa buffet lẩu nướng thả ga";
    if (totalAmount < 700000) return "1 chiếc bàn phím cơ gõ êm tai";
    if (totalAmount < 2000000) return "1 vé máy bay khứ hồi Đà Nẵng";
    return "Nửa chỉ vàng 9999 PNJ";
  }
};

export const getSlothTitle = (snoozeCount: number): { title: string; badge: string; color: string } => {
  if (snoozeCount === 0) return { title: "Chiến thần kỷ luật", badge: "🏆 Early Bird", color: "text-emerald-400" };
  if (snoozeCount <= 2) return { title: "Tập sự ngủ nướng", badge: "☕ Ngái ngủ nhẹ", color: "text-yellow-400" };
  if (snoozeCount <= 5) return { title: "Nhà tài trợ giấc ngủ", badge: "💸 Đốt ví bậc thầy", color: "text-amber-500" };
  if (snoozeCount <= 10) return { title: "Kiện tướng nướng giường", badge: "🔥 Lười mãn tính", color: "text-orange-500" };
  return { title: "Chúa tể ngủ ráng - Triệu phú phá sản", badge: "👑 VIP Hội Lười", color: "text-red-500" };
};
