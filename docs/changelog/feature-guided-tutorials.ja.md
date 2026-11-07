# ガイド付きチュートリアル

**Feature Branch:** feature-guided-tutorials

## 技術仕様

ホストの公開モジュール対象機能を使い、管理者にこのモジュールのマーケットプレイスカードを示します。認証情報の読み取りや変更は行いません。

モジュールは ctx 経由で手順と翻訳済みテキストを登録します。ホストが一覧、説明、矢印、強調表示、キーとポインターの制御、アクセス確認付き SPA ナビゲーション、アクセシビリティを担当します。閉じる操作、手順外への移動、権限の喪失、モジュールの無効化でセッションを終了します。プロバイダーのマウント失敗時は登録を取り消します。

プロバイダーテストでは公開契約、4 言語の翻訳、利用条件、失敗時の後処理、未対応ホストバージョンの拒否を確認します。

## ページ連動の初回ガイド

ホストは説明、矢印、強調表示、アクセシビリティ、共通のフローティング操作メニューを担当します。初回は常に「次へ」を表示し、中止とスキップは表示しません。再生時の中止には `btn-cancel` を使います。完了はブラウザー内でアカウント別に保存します。移動、アクセス喪失、プロバイダー解除でセッションを終了し、マウント失敗では登録を取り消します。

## 操作に役立つ説明

各ステップではページの操作項目と作業を説明し、権限やガイドが実行しない操作についての不要な説明を省きます。

## ステップごとに次へ進む強調を指定

各ステップで `highlightNext` を明示します。「次へ」や「完了」が必要な説明では有効にし、操作や待機条件で進む練習では無効にします。動きを減らす設定では静的な枠を表示します。

すべての UI コンポーネントにチュートリアルを用意します。開発ガイドラインでは、利用者の目的に沿う操作説明と、機能や UI 動作の変更に伴う既存チュートリアルの見直しを求めます。

## 表示されるチュートリアル対象

強調する領域と「次へ」の強調を明示します。

## 共通のフローティングメニュー待ち行列

メニューはホスト共通の待ち行列とコンポーネントの寿命に従います。

## 復旧操作の説明

対象がない画面では「次へ」と最初からやり直す操作を提供し、再実行では中止も選べます。

## 目的の明確なガイド

表示順に沿って異なる可視操作を説明します。共通指針は画面状態の検出、安定した例、空の状態、条件付き分岐、ライフサイクルの後処理を扱います。再実行操作と動きを減らす設定の文書をホストと一致させます。

## コミット

- [8a833d3](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8a833d311d6081e5f334759ebdeca75284117e80)
- [8e04486](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8e044869c477a4bcd7c9326f5495ddb77c5b142f)
- [29faa2b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/29faa2b205e9438ba21114715dc348bc921e2db6)
- [12f91d1](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/12f91d1edc8ef2b566ae7587a1a3b5b9fed0011b)
- [ff982d9](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/ff982d9087add1a1a1d2db0225c2974e57f9bd66)
- [e74c00138](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/e74c00138be73caf8dce73afd6d5690878033594)
- [a1451bd2c](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/a1451bd2c93bc2bdfedf01318185caadbaaee51a)
