# ⏰ Snooze Tax (Nice Alarm) — Báo Thức Phạt Tiền

Ứng dụng báo thức tính tiền chuộc giấc ngủ: **Mỗi lần bấm SNOOZE bị trừ $5 (hoặc 50.000đ)**.

---

## 📱 CẤU TRÚC DỰ ÁN NATIVE CHO ANDROID & IOS

Dự án này là một ứng dụng Native đầy đủ, bao gồm toàn bộ mã nguồn cấu hình cho cả hai nền tảng di động:

```
├── android/            # Mã nguồn Native Android (Android Studio / Gradle / Java)
│   ├── app/src/main/AndroidManifest.xml  # Đã cấu hình quyền Exact Alarm, WakeLock, Vibrate
│   └── app/build.gradle                  # Cấu hình Gradle build APK/AAB
│
├── ios/                # Mã nguồn Native iOS (Xcode / CocoaPods / Swift)
│   ├── App/App/Info.plist                # Đã cấu hình quyền Background Audio, Notifications
│   └── App/App.xcworkspace              # Không gian làm việc Xcode chính thức
│
├── src/                # Mã nguồn Logic Báo thức, UI, Web Audio API Sound Engine, VietQR
├── public/             # Icons, Manifest PWA
└── MARKETING_AND_SEO_GUIDE.md  # Toàn bộ kịch bản TikTok và ASO App Store
```

---

## 🤖 HƯỚNG DẪN BUILD & CÀI ĐẶT LÊN ĐIỆN THOẠI ANDROID (.APK)

### Cách 1: Sử dụng Android Studio (Dễ nhất trên máy tính)
1. Mở phần mềm **Android Studio**.
2. Chọn **Open an Existing Project** và trỏ đến thư mục:
   ```
   E:\ai\nice alarm\android
   ```
3. Cắm điện thoại Android vào máy tính qua cáp USB (đã bật *USB Debugging* trong Tùy chọn nhà phát triển).
4. Nhấn nút **Run (Tam giác xanh)** để cài trực tiếp app vào điện thoại.
5. Hoặc trên thanh menu chọn: **Build > Build Bundle(s) / APK(s) > Build APK(s)** để xuất ra file `app-debug.apk` chép vào máy cài đặt.

### Cách 2: Tự động Build APK trên GitHub Actions (Không cần cài Android Studio)
- Dự án đã tích hợp sẵn file `.github/workflows/build-apk.yml`.
- Khi đẩy code lên GitHub, GitHub Actions sẽ tự động biên dịch và trả về file `.apk` tải về cài ngay trên điện thoại!

---

## 🍏 HƯỚNG DẪN BUILD & CÀI ĐẶT LÊN IPHONE / IPAD (IOS)

### Sử dụng Xcode (trên máy Mac):
1. Mở terminal tại thư mục dự án và chạy:
   ```bash
   npx cap open ios
   ```
2. Xcode sẽ tự động mở file `ios/App/App.xcworkspace`.
3. Chọn Apple ID của bạn ở mục **Signing & Capabilities**.
4. Cắm iPhone vào máy Mac và nhấn nút **Play / Run** để cài thẳng lên iPhone.

---

## 🚀 CÁC LỆNH PHÁT TRIỂN CHÍNH

```bash
# Cài đặt thư viện
npm install

# Khởi chạy bản web dev
npm run dev

# Đóng gói và đồng bộ sang Android & iOS
npm run build
npx cap sync
```
