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

## 明示的な言語を反映

対応する明示言語の要求にはFlash v2.5を使用し、英語IPA合成を維持し、未対応コードはプロバイダー呼び出し前に拒否します。

## プレビューを一時的に保持

テスト文を設定保存から除外し、既存のプレビュー文を読み込み時に削除し、保存値を変更せずに不完全な設定を拒否します。

## 運用音声フローを無効化

無効時は設定専用サービスを読み込みます。管理者の音声検索とテストプレビューは引き続き利用できますが、汎用合成フローは登録しません。

## 応答を制限して解放

受け付ける長文には最大64 MiBのMP3音声を許可します。エラー応答や不正なメディアの本文を中断してから安定したエラーを返します。

## 認証情報保存の前提条件

現在のホスト契約は設定応答をマスクしますが、不透明参照を返す認証情報ストアは提供しません。安全なホスト側保存は[Cognis #515](https://github.com/Cognis-Labs-HQ/Cognis/issues/515)に未解決として記録し、APIキーは引き続き設定データベースに保存されます。

## コミット

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
- [fa92c9b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fa92c9b607e5a21abc2db3b63c231fa32888b378)
- [dd89029](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/dd890299216d6f2ebe0fa6caf41103f64cfcde8f)
