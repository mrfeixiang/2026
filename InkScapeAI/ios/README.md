# InkScape AI — iOS App (SwiftUI)

V0.1 client: pick a photo → choose a style → **入画** → view/save/share the poster.

## Files
```
ios/InkScapeAI/
  InkScapeAIApp.swift   App entry
  API.swift             Backend client + models (set baseURL here)
  HomeView.swift        Photo picker + style grid + Generate
  ResultView.swift      Poster view + Save-to-album + Share
```

## Create the Xcode project (5 minutes)
There's no `.xcodeproj` checked in (it's machine-specific and noisy in git).
Create one and drop these sources in:

1. **Xcode → File → New → Project → iOS → App.**
   - Product Name: `InkScapeAI`
   - Interface: **SwiftUI**, Language: **Swift**
2. Delete the auto-generated `ContentView.swift` and the default `App.swift`.
3. Drag the four files from `ios/InkScapeAI/` into the project
   ("Copy items if needed" checked).
4. Set the backend address in `API.swift → Config.baseURL`:
   - iOS **Simulator** on the same Mac as the backend → `http://127.0.0.1:8000`
   - Real **iPhone** → your Mac's LAN IP, e.g. `http://192.168.1.20:8000`
     (same Wi-Fi network).

## Allow local HTTP (dev only)
Local dev uses plain `http`, which App Transport Security blocks by default.
Add this to **Info** (or Info.plist) while developing:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key><true/>
</dict>
```

Photo access uses `PhotosPicker`, which needs **no** usage-description string.
Saving to the album does — add:

```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>保存生成的国画海报到相册</string>
```

## Run
1. Start the backend (see `../backend/README.md` — `./run.sh`).
2. Build & run the app on a simulator or device.
3. Upload a photo, pick a style, tap **入画**.

> For TestFlight later: set `baseURL` to your deployed backend's HTTPS URL,
> then Archive → Distribute → App Store Connect.
