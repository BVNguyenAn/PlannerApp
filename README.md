
# JumpPlannerApp (iOS)
SwiftUI + WKWebView nhúng web timetable. Dữ liệu lưu file JSON trong Documents/lich_tap.json.

## Build nhanh (Xcode)
1) Xcode → File > New > Project… → App (SwiftUI), đặt tên `JumpPlannerApp`.
2) Kéo **JumpPlannerApp.swift, ContentView.swift, WebView.swift, Storage.swift** vào project (Add to target).
3) Kéo thư mục **www** vào project, chọn **Create folder references** (màu xanh), tick target app.
4) Run trên simulator/device.
5) Archive → Distribute App → Ad Hoc / Development / App Store → xuất `.ipa`.

## Ghi chú
- Nút **Lưu** sẽ gọi native để ghi `lich_tap.json`.
- Nút **Reset dữ liệu** sẽ xoá file JSON và dùng mặc định.
- Checklist ✓ dùng localStorage (theo thiết bị). Nếu muốn cũng lưu vào JSON, có thể chỉnh app.js để push trạng thái tick vào DATA.
