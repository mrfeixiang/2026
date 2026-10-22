import Foundation
import UIKit

/// Backend base URL.
/// - Simulator on the same Mac as the backend: use http://127.0.0.1:8000
/// - A real iPhone: use your Mac's LAN IP, e.g. http://192.168.1.20:8000
///   (both devices on the same Wi-Fi; the backend already allows CORS).
enum Config {
    static let baseURL = URL(string: "http://127.0.0.1:8000")!
}

struct PaintingStyle: Identifiable, Decodable, Hashable {
    let id: String
    let name_zh: String
    let name_en: String
    let seal: String
}

struct Analysis: Decodable {
    let themes: [String]
    let suggested_style: String?
    let title: String?
    let poem: String?
    let source: String
}

struct GenerateResponse: Decodable {
    let id: String
    let style: String
    let image_url: String
    let image_base64: String
    let title: String
    let poem: String
    let seal: String
    let analysis: Analysis
}

enum APIError: LocalizedError {
    case badImage
    case server(String)
    var errorDescription: String? {
        switch self {
        case .badImage: return "无法读取所选图片"
        case .server(let m): return m
        }
    }
}

struct API {
    static func fetchStyles() async throws -> [PaintingStyle] {
        let url = Config.baseURL.appendingPathComponent("api/styles")
        let (data, _) = try await URLSession.shared.data(from: url)
        struct Wrapper: Decodable { let styles: [PaintingStyle] }
        return try JSONDecoder().decode(Wrapper.self, from: data).styles
    }

    static func generate(image: UIImage, style: String) async throws -> GenerateResponse {
        guard let jpeg = image.jpegData(compressionQuality: 0.9) else { throw APIError.badImage }
        let body: [String: Any] = [
            "style": style,
            "image": "data:image/jpeg;base64," + jpeg.base64EncodedString(),
        ]
        var req = URLRequest(url: Config.baseURL.appendingPathComponent("api/generate"))
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try JSONSerialization.data(withJSONObject: body)
        req.timeoutInterval = 120

        let (data, resp) = try await URLSession.shared.data(for: req)
        if let http = resp as? HTTPURLResponse, http.statusCode != 200 {
            throw APIError.server("服务器错误 \(http.statusCode): \(String(data: data, encoding: .utf8) ?? "")")
        }
        return try JSONDecoder().decode(GenerateResponse.self, from: data)
    }
}

extension UIImage {
    /// Decode a `data:image/png;base64,...` URI into a UIImage.
    static func from(dataURI: String) -> UIImage? {
        guard let comma = dataURI.firstIndex(of: ","),
              let data = Data(base64Encoded: String(dataURI[dataURI.index(after: comma)...]))
        else { return nil }
        return UIImage(data: data)
    }
}
