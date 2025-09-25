
import Foundation

enum Storage {
    static let fileName = "lich_tap.json"
    
    static func documentsURL() -> URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    }
    
    static func fileURL() -> URL {
        documentsURL().appendingPathComponent(fileName)
    }
    
    static func loadJSON() -> String? {
        let url = fileURL()
        if FileManager.default.fileExists(atPath: url.path) {
            return try? String(contentsOf: url, encoding: .utf8)
        } else {
            return nil
        }
    }
    
    static func saveJSON(_ json: String) {
        let url = fileURL()
        do {
            try json.data(using: .utf8)?.write(to: url)
        } catch {
            print("Save JSON error:", error)
        }
    }
    
    static func deleteJSON() {
        let url = fileURL()
        try? FileManager.default.removeItem(at: url)
    }
    
    static func defaultJSON() -> String {
        let defaultObj: [String: Any] = [
            "Thứ 2": ["type":"train", "items":[
                "Ngày 1 – Sức mạnh chân","Squat 4×20","Jump Squat 4×10–12","Lunge 3×12 mỗi chân","Glute Bridge 3×15–20","Calf Raise 4×25–30"
            ]],
            "Thứ 3": ["type":"rest", "items":[
                "Nghỉ / giãn cơ nhẹ","Đi bộ 15–30′","Bóng chuyền thoải mái"
            ]],
            "Thứ 4": ["type":"train", "items":[
                "Ngày 2 – Plyometric + Core","Box Jump 4×6–8","Broad Jump 3×6","Tuck Jump 3×10","Burpee Jump 3×12","Plank 3×45–60s","Russian Twist 3×20"
            ]],
            "Thứ 5": ["type":"rest", "items":[
                "Nghỉ / tập nhẹ nhàng","Đi bộ / giãn cơ 10–15′"
            ]],
            "Thứ 6": ["type":"train", "items":[
                "Ngày 3 – Sức mạnh bổ trợ + Thân trên","Pistol Squat 3×6–8 mỗi chân","Bulgarian Split Squat 3×10 mỗi chân","Wall Sit 3×45–60s","Push-up 4×15–20","Pull-up / Inverted Row 3× tối đa"
            ]],
            "Thứ 7": ["type":"rest", "items":[
                "Nghỉ / vận động nhẹ","Đi bộ / đạp xe 15–20′"
            ]],
            "Chủ Nhật": ["type":"train", "items":[
                "Ngày 4 – Plyometric nâng cao","Depth Jump 4×6","Single-leg Hop 3×8–10 mỗi chân","Skater Jump 3×12 mỗi bên","Sprint 20m ×6–8","Side Plank 3×30–45s mỗi bên","Mountain Climber 3×30s"
            ]],
        ]
        let data = try! JSONSerialization.data(withJSONObject: defaultObj, options: [.prettyPrinted, .sortedKeys])
        return String(data: data, encoding: .utf8)!
    }
}
