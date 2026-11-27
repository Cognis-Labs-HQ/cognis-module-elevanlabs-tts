# 技術情報

ElevenLabs 音声 の公開インターフェース、設定、ライフサイクルを説明します。

## インターフェース

管理者の設定ポップアップから設定します。無効時も設定できます。ElevenLabs APIキーを入力し、音声を検索して既定の声を選ぶか、検索できない場合はIDを手動入力します。テスト音声は保存前の入力値を使用します。キーは読み出し時に非表示となり、再起動や無効化後も保持されます。モジュールのコンテンツを削除するとキーも削除されます。

## 設定

対応する設定と依存関係はモジュールのマニフェストで宣言します。Administration では担当モジュールまたは宣言された認証アダプターだけを設定します。有効時と無効時の入口はマニフェストに従います。

### 宣言された管理者用フィールド

| 項目       | 型         |
| ---------- | ---------- |
| `apiKey`   | `password` |
| `voiceId`  | `string`   |
| `testText` | `string`   |

## 動作

### 使用方法

```js
const speech = ctx.getCapability("elevenlabs-tts:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

有効なモジュールは `elevenlabs-tts:synthesis` を公開します。`synthesize({ text, language?, voiceId?, phonemes? }, signal?)` は `{ mediaType, data }` を返します。`voiceId` の省略時は既定の声を使用します。設定保存で `revision` が変わり、呼び出し側でキャッシュを更新できます。英語IPAは `eleven_turbo_v2` のSSMLを使用します。明示的な言語要求は対応言語コードを反映する `eleven_flash_v2_5` を使用し、未対応コードは送信前に拒否します。言語省略時は `eleven_multilingual_v2` が自動判定します。入力は5000文字までで、MP3出力にも上限があります。固定HTTPS接続先を使い、リダイレクトを拒否し、タイムアウトを設定します。終了時は実行中の要求を中断します。ログにキー、テキスト、音声を記録しません。

`/api/v1/modules/elevenlabs-tts/config` は管理者専用のGET、PUT、DELETE、およびPOST `/voices`（ページ単位の検索）と `/test`（音声プレビュー）を提供します。両操作は現在のフォーム値を受け取り、キー省略時は保存済みキーを保持します。無効時は設定ルートのみ実行します。保存には `db:executor` を使用し、DBドライバーは同梱しません。

音声機能はStudy固有の規則を持ちません。呼び出し側が権限と名前空間を検証します。Cognis Studyは保存済みグローバルカードのみ音声生成し、個人・クラスカードでは録音または既存の構成カード音声を結合します。このリポジトリは言語コンテンツパックを含みません。

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`

インストール済みCLIの `cognisctl modules:elevenlabs-tts:voices` で音声を検索します。保存済み設定と認証済み管理者専用の `/config/voices` ルートを使い、プロバイダーのページ処理にも対応します。CLIヘルプは現在、文字列の説明のみ受け付けます。音声・設定の実行時メッセージはホストが翻訳します。モジュール画像には公式サイトのElevenLabsマークとCognis/ElevenLabsの複合バナーを使用します。

5000文字の入力上限と128 kbpsの出力に対し、音声応答を64 MiBに制限します。設定保存時は変更のないマスク値を統合した後、空でないAPIキーと既定の声が必要です。プレビュー文は一時的です。設定保存から除外し、読み出しは空欄を返し、旧設定の読み込み時に保存済みテスト文を削除します。無効時は管理用フローのみ登録し、`elevenlabs-tts:synthesize` は登録しません。拒否したプロバイダー応答の本文は中断してから安定したエラーを返します。

ホストの非表示値契約はAPI読み出し時の認証情報のマスクを提供しますが、暗号化された認証情報保存や不透明参照を返すシークレットストア機能は提供しません。運用APIキーはモジュールの設定データベースに残ります。ホスト側保存の前提条件は [Cognis #515](https://github.com/Cognis-Labs-HQ/Cognis/issues/515) に記録しています。

`elevenlabs-tts:synthesis` はモジュール自身の名前空間を使い、マニフェストでホストの特権アクセスを要求しません。英語・日本語Studyは既存の任意依存関係を利用し、ctx経由で機能を解決します。Studyの橋渡し処理は呼び出し側から現在の機能を取得する関数を受け取り、無効化・再有効化と設定済み音声に対応します。

公開機能は `configured` で現在の準備状態を通知します。StudyはAPIキーと既定の声が保存された後にのみ自動音声を有効にします。ElevenLabsが未導入・無効・未設定でも言語登録は成功し、アップロード音声と既存音声の結合を利用できます。合成は要求しません。

プロバイダーテストでは公開契約、4 言語の翻訳、利用条件、失敗時の後処理、未対応ホストバージョンの拒否を確認します。

ホスト共通の待ち行列でフローティング操作を提供します。初回は次へ・完了のみで中止やスキップはなく、再実行では最後の表示ステップより前にスキップを使えます。最初の表示ステップの後から再開始できます。内容の更新後も完了を維持します。明示的な highlightNext は説明ステップの呼吸するようなアニメーションだけを有効にし、動きを減らす設定では停止します。各段階は表示順に沿って異なる実操作を強調します。ガイドは現在の画面に結び付き、空や省略可能な状態を扱い、移動や所有者解除で後処理を行います。

## セキュリティ

サービスへの通信は固定の HTTPS 接続先を使い、リダイレクトを拒否して音声サイズを制限します。設定の読み取りでは API キーを隠しますが、キー自体は設定データベースに保存されます。表示上の秘匿は暗号化した秘密情報保管を意味しません。呼び出し側が内容への権限を確認し、ログにキー、入力文、音声を含めず、プレビュー文も保存しません。

## リファレンス

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### 名前の検証

`npm test` はローカルの構文木検出器で、bootstrap、スクリプト、テスト、フィクスチャを含むバインディング名を検証します。構文解析エラーがある場合、検証は失敗します。回帰検証用フィクスチャは、宣言、引数、プライベートメンバー、TypeScript の型アサーション、有効な型専用名を検証します。共通方針は[ホストの命名標準](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.ja.md#バインディング名)を参照してください。
