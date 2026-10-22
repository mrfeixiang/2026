import SwiftUI

struct ResultView: View {
    let result: GenerateResponse
    @State private var saved = false

    private var poster: UIImage? { UIImage.from(dataURI: result.image_base64) }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                if let poster {
                    Image(uiImage: poster)
                        .resizable().scaledToFit()
                        .cornerRadius(10)
                        .shadow(radius: 8, y: 4)
                } else {
                    Text("无法显示海报").foregroundColor(.secondary)
                }

                VStack(spacing: 6) {
                    Text(result.title).font(.title3).fontWeight(.semibold)
                    Text(result.poem).multilineTextAlignment(.center).foregroundColor(.secondary)
                    Text("印：\(result.seal) · \(result.analysis.source == "gpt" ? "AI 创作" : "经典配诗")")
                        .font(.caption2).foregroundColor(.secondary)
                }

                if let poster {
                    Button {
                        UIImageWriteToSavedPhotosAlbum(poster, nil, nil, nil)
                        saved = true
                    } label: {
                        Label(saved ? "已保存到相册" : "保存到相册", systemImage: saved ? "checkmark" : "square.and.arrow.down")
                            .frame(maxWidth: .infinity).padding()
                            .background(Color(red: 0.69, green: 0.16, blue: 0.16))
                            .foregroundColor(.white).cornerRadius(14)
                    }

                    ShareLink(item: Image(uiImage: poster), preview: SharePreview(result.title, image: Image(uiImage: poster))) {
                        Label("分享 · Share", systemImage: "square.and.arrow.up")
                            .frame(maxWidth: .infinity).padding()
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.secondary.opacity(0.4)))
                    }
                }
            }
            .padding()
        }
        .background(Color(red: 0.96, green: 0.94, blue: 0.90).ignoresSafeArea())
        .navigationTitle("成品 · Poster")
        .navigationBarTitleDisplayMode(.inline)
    }
}
