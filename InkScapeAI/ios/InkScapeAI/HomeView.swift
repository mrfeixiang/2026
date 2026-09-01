import SwiftUI
import PhotosUI

struct HomeView: View {
    @State private var styles: [PaintingStyle] = []
    @State private var selectedStyle: String = "ink"
    @State private var pickerItem: PhotosPickerItem?
    @State private var sourceImage: UIImage?
    @State private var isGenerating = false
    @State private var result: GenerateResponse?
    @State private var errorMessage: String?

    private let paper = Color(red: 0.96, green: 0.94, blue: 0.90)
    private let cinnabar = Color(red: 0.69, green: 0.16, blue: 0.16)

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    header

                    PhotosPicker(selection: $pickerItem, matching: .images) {
                        photoWell
                    }

                    styleGrid

                    Button(action: generate) {
                        HStack {
                            if isGenerating { ProgressView().tint(.white) }
                            Text(isGenerating ? "生成中…" : "入画  ·  Generate")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(canGenerate ? cinnabar : Color.gray.opacity(0.4))
                        .foregroundColor(.white)
                        .cornerRadius(14)
                    }
                    .disabled(!canGenerate || isGenerating)

                    if let errorMessage {
                        Text(errorMessage).foregroundColor(.red).font(.footnote)
                    }
                }
                .padding()
            }
            .background(paper.ignoresSafeArea())
            .navigationDestination(item: $result) { r in ResultView(result: r) }
        }
        .task { await loadStyles() }
        .onChange(of: pickerItem) { _, item in Task { await loadImage(item) } }
    }

    private var header: some View {
        VStack(spacing: 6) {
            Text("墨境").font(.system(size: 40, weight: .bold))
            Text("InkScape AI").tracking(4).font(.subheadline).foregroundColor(.secondary)
            Text("一张照片，一幅中国画。").font(.footnote).foregroundColor(.secondary)
        }
        .padding(.top, 12)
    }

    private var photoWell: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .strokeBorder(style: StrokeStyle(lineWidth: 1.5, dash: [6]))
                .foregroundColor(.secondary.opacity(0.5))
                .frame(height: 240)
            if let img = sourceImage {
                Image(uiImage: img).resizable().scaledToFill()
                    .frame(height: 240).clipShape(RoundedRectangle(cornerRadius: 16))
            } else {
                VStack(spacing: 8) {
                    Image(systemName: "photo.on.rectangle.angled").font(.largeTitle)
                    Text("上传照片 · Upload Photo").font(.callout)
                }.foregroundColor(.secondary)
            }
        }
    }

    private var styleGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(styles) { style in
                let selected = style.id == selectedStyle
                VStack(spacing: 4) {
                    Text(style.name_zh).font(.headline)
                    Text(style.name_en).font(.caption2).foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity).padding(.vertical, 14)
                .background(selected ? cinnabar.opacity(0.12) : Color.white.opacity(0.6))
                .overlay(RoundedRectangle(cornerRadius: 12)
                    .stroke(selected ? cinnabar : Color.clear, lineWidth: 2))
                .cornerRadius(12)
                .onTapGesture { selectedStyle = style.id }
            }
        }
    }

    private var canGenerate: Bool { sourceImage != nil }

    private func loadStyles() async {
        do { styles = try await API.fetchStyles() }
        catch { errorMessage = "无法连接后端。请确认 Backend 已运行。" }
    }

    private func loadImage(_ item: PhotosPickerItem?) async {
        guard let item else { return }
        if let data = try? await item.loadTransferable(type: Data.self),
           let img = UIImage(data: data) {
            sourceImage = img
            result = nil
        }
    }

    private func generate() {
        guard let img = sourceImage else { return }
        isGenerating = true; errorMessage = nil
        Task {
            defer { isGenerating = false }
            do { result = try await API.generate(image: img, style: selectedStyle) }
            catch { errorMessage = error.localizedDescription }
        }
    }
}

extension GenerateResponse: Hashable {
    static func == (l: GenerateResponse, r: GenerateResponse) -> Bool { l.id == r.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
