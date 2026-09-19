import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Video,
  Search,
  Share2,
  TrendingUp,
  Copy,
  Check,
  Flame,
  Smartphone,
  Tag,
  MessageSquare
} from 'lucide-react';

interface MarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketingModal: React.FC<MarketingModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'aso' | 'memes' | 'guerilla'>('tiktok');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Chiến Lược Marketing Bựa & SEO Triệu View
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
                  Viral 100%
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kịch bản TikTok, ASO App Store / Google Play & Du kích meme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1.5 my-4 p-1 bg-slate-800/80 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tiktok'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Kịch Bản Video</span>
          </button>

          <button
            onClick={() => setActiveTab('aso')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'aso'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>ASO & Từ Khóa</span>
          </button>

          <button
            onClick={() => setActiveTab('memes')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'memes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Góc Meme Bựa</span>
          </button>

          <button
            onClick={() => setActiveTab('guerilla')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guerilla'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Chiến Dịch Du Kích</span>
          </button>
        </div>

        {/* Tab 1: TikTok & Reels Scripts */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4">
            {/* Script 1 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Kịch bản 1: Troll Người Yêu Kiếm 500k
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      'script1',
                      `KỊCH BẢN TIKTOK 1: "CÁCH TÔI KIẾM 500K MỖI SÁNG TỪ NGƯỜI YÊU LƯỜI"\n- Hook 0-3s: (Quay mặt đắc ý, màn hình tài khoản ngân hàng +500.000đ) "Nếu người yêu bạn lười dậy sớm, đừng cằn nhằn, hãy làm giàu từ anh ấy!"\n- Thân bài (4-15s): Cài app Snooze Tax vào máy người yêu, đặt tài khoản thụ hưởng là VietQR của mình, mức phạt 50k/lần Snooze. Sáng hôm sau: Chuông reo, anh ta còn đang mắt nhắm mắt mở với tay bấm nút Snooze 5 lần... Điện thoại mình liên tục nổ thông báo tài khoản +50k, +50k!\n- Kêu gọi (16-20s): "Tag ngay đứa bạn lười ngủ nướng vào đây để làm giàu nào!"`
                    )
                  }
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy kịch bản"
                >
                  {copiedId === 'script1' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Hook (3s đầu):</strong> Quay cận cảnh người yêu đang trùm chăn, tiếng chuông
                hú inh ỏi. Chữ to trên màn hình: <em>"Mỗi lần anh ấy hoãn báo thức, tôi có 50.000đ ăn sáng."</em>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                <strong>Âm thanh gợi ý:</strong> Tiếng chuông báo thức dồn dập + tiếng nhạc tiền xu "Cha-ching" rơi lộp độp + voice AI châm biếm.
              </p>
            </div>

            {/* Script 2 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Kịch bản 2: POV "Thử Thách Người Giàu Ngủ Ráng"
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      'script2',
                      `KỊCH BẢN TIKTOK 2: POV THỬ THÁCH NGƯỜI GIÀU\n- Hook 0-3s: "Tôi có $100 và tôi sẽ đốt sạch chỉ bằng cách... ngủ tiếp!"\n- Cảnh quay: Màn hình app Snooze Tax hiển thị nút -$5/lần. Mỗi lần bấm, màn hình rung chuyển, âm thanh nổ ra: "Chúc mừng đại gia vừa đốt 1 cốc Starbucks!". Đến lần thứ 8 thì mếu máo bật dậy vì xót ruột!\n- Kết luận: "App báo thức duy nhất không cần đánh thức bạn bằng tiếng ồn, mà đánh thức bằng nỗi đau ví tiền!"`
                    )
                  }
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId === 'script2' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Ý tưởng:</strong> Người chơi giả vờ tự tin giàu có bấm nút Snooze liên tục,
                nhưng app bắt giải toán + trừ sạch tiền quỹ nhậu khiến người xem vừa cười vừa đồng cảm.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: ASO & Keywords */}
        {activeTab === 'aso' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Tiêu đề ASO Tối Ưu (App Store & Google Play)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold">Tên App iOS (Title 30 ký tự):</p>
                  <p className="font-mono text-white bg-slate-900 p-2 rounded-lg mt-1 border border-slate-800">
                    Snooze Tax: Báo Thức Phạt Tiền
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-semibold">Phụ đề iOS (Subtitle 30 ký tự):</p>
                  <p className="font-mono text-white bg-slate-900 p-2 rounded-lg mt-1 border border-slate-800">
                    Ngủ Nướng Mất $5 Trị Bệnh Lười
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-semibold">Tiêu đề Google Play Store (50 ký tự):</p>
                  <p className="font-mono text-white bg-slate-900 p-2 rounded-lg mt-1 border border-slate-800">
                    Snooze Tax: Báo Thức Thông Minh Trừ Tiền Ngủ Nướng
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Bộ Từ Khóa Vàng (ASO Keywords)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Các từ khóa có lượng tìm kiếm cao về thói quen dậy sớm và giải pháp trị ngủ nướng:
              </p>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  'báo thức',
                  'alarm clock',
                  'snooze fee',
                  'trị ngủ nướng',
                  'dậy sớm',
                  'báo thức thông minh',
                  'pay to snooze',
                  'vietqr',
                  'kỷ luật bản thân',
                  'giải toán tắt báo thức',
                  'báo thức nộp phạt',
                  'early bird'
                ].map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Memes & Social angles */}
        {activeTab === 'memes' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Meme 1: Caption Đăng Facebook / Threads
              </span>
              <p className="text-xs text-slate-200 mt-2 italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                "Thầy bói bảo năm nay tôi bị hao tài tốn của vào buổi sáng. Hóa ra là vì sáng nào tôi
                cũng hào phóng tặng 200k cho cái nút Snooze của app báo thức..."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Meme 2: "Khách Sạn Đắt Nhất Thế Giới"
              </span>
              <p className="text-xs text-slate-200 mt-2 italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                "Khách sạn Burj Al Arab Dubai: $1500/đêm.<br />
                Chiếc giường của tôi lúc 6h30 sáng: $5 cho mỗi 5 phút ngủ thêm.<br />
                Đúng là nơi nghỉ dưỡng xa xỉ bậc nhất hành tinh!"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Meme 3: "Người Yêu Hoàn Hảo"
              </span>
              <p className="text-xs text-slate-200 mt-2 italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                "Em không cần anh hứa yêu em mãi mãi, em chỉ cần anh cài app Snooze Tax và để số tài
                khoản nhận tiền phạt là số thẻ của em thôi!"
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Guerilla Campaign */}
        {activeTab === 'guerilla' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-400" />
                1. Thách Đấu "Ai Giàu Nhất Hội Lười" (Leaderboard)
              </h4>
              <p className="text-slate-400">
                Tổ chức mini contest trên TikTok/Facebook: Ai có tổng tiền phạt ngủ nướng trong tuần cao nhất sẽ được cộng đồng tài trợ... một hộp cà phê siêu đắng!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                2. Quỹ "Tiền Phạt Làm Từ Thiện"
              </h4>
              <p className="text-slate-400">
                Cho phép người dùng chọn chuyển tiền phạt Snooze vào các tổ chức từ thiện (nuôi em, cơm có thịt, cứu trợ động vật). Người dùng vừa được ngủ thêm mà vừa thấy "mình đang làm việc thiện", tạo thiện cảm viral cực lớn trên mạng xã hội!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-purple-400" />
                3. Chiến Dịch "Vợ Trả Thù Bằng Báo Thức"
              </h4>
              <p className="text-slate-400">
                Hợp tác với các hội nhóm "Chị Em Bỉm Sữa", "Hội Yêu Bếp", hướng dẫn các bà vợ cài app lên máy chồng để sáng nào cũng được nhận tiền ăn sáng tự động mỗi khi chồng lười dậy!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            Đã Hiểu, Sẵn Sàng Triển Khai!
          </button>
        </div>
      </div>
    </div>
  );
};
