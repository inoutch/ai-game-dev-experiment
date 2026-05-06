# Vertical 3D Racer

スマホ縦画面を前提にした、PWA対応の3Dレースゲームです。

## セットアップ

```bash
npm ci
npm run dev
```

## 必須要件への対応

- **スマホ縦画面**: PWA manifest の `orientation: portrait` とモバイルHUD最適化UI。
- **Web(PWA)**: `vite-plugin-pwa` を利用。
- **3D**: Three.js を利用したWebGLレンダリング。
- **90%完成度を目指す進め方**:
  - 1) コア体験（運転・衝突・スコア）
  - 2) モバイルUIと描画品質
  - 3) PWA・デプロイ自動化
  - 4) QAと拡張（効果音、コース分岐、敵AI改善）

## Netlify + GitHub Actions

1. NetlifyでSiteを作成し `Site ID` を控える
2. GitHub repository secrets に以下を設定
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. `main` へ push すると `.github/workflows/netlify-deploy.yml` が本番デプロイ

## アイコン運用

- リポジトリ運用上、バイナリ（PNG）を含めず、PWAアイコンはSVGを利用しています。

## 既知の改善余地

- 車体モデルの高品質化（GLTF）
- UIアニメーション・サウンド
- ラップ制と順位システム
