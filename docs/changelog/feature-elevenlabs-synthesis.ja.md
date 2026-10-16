# 共通音声機能の統合

**機能ブランチ:** feature-elevenlabs-synthesis

## 使用方法

ElevenLabs合成を設定可能な独立モジュールへ移します。Studyは保存済みグローバルカードに言語ごとの任意の声を使用し、個人・クラスカードは上限付きアップロードとマイク録音を受け付けます。既存の構成カード音声を連続結合する代替機能を維持し、管理者は編集時にグローバル音声を再生成できます。

## Study有効化の修正

同梱音声の削除時に英語と日本語の実際のコンテンツパックのバージョンを上げます。有効化の失敗を返す前に他のモジュールの再構築を完了し、同意ルートの登録済みフローを維持します。

## プロバイダー画像とCLI

公式ElevenLabsロゴを鮮明なSVGアイコンとして使用し、Cognis/ElevenLabsの複合バナーを追加します。リリースファイル名を宣言した機能ブランチに合わせます。インストール済みの `cognisctl modules:elevenlabs-tts:voices` は認証済み公開設定APIから音声を検索します。

## 設定境界の検証

不正な設定要求は内容を含めずに記録し、過大な本文をHTTP 413で拒否し、不正な設定とプロバイダー障害を区別します。固定のテスト用フレーズを削除し、既存の開発者ドキュメントの見出しを維持します。

## コミット

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
