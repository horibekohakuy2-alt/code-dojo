# Code Dojo — プログラミング学習アプリ

「説明を読む → 手本を見て書く → 何も見ずに書く」の3段階で学ぶ、ブラウザ完結型のプログラミング学習アプリ。全11ユニット・42レッスン収録。

## 起動方法

`index.html` をダブルクリックしてブラウザで開くだけ。自己完結型なので、この1ファイルをどこにコピーしても動く。

- HTML / CSS / JavaScript / Git ユニット: 完全オフラインで動作
- TypeScript / React / Next.js / React Native / Python / SQL ユニット: プレビュー実行に**ネット接続が必要**（Babel・React・Pyodide・sql.jsをCDNから読み込むため）。説明を読む・タイピング練習するだけならオフラインでも可

## 学び方（1レッスン = 3ステップ）

1. **① 説明** — 妥協なしの詳しい説明を読む
2. **② 手本を見て入力** — 手本コードを1文字ずつ入力。緑=正解、赤=ミスがリアルタイム表示。完全一致でクリア（タイピング練習兼用）
3. **③ 見ないで挑戦** — お題と「使ってよい要素」だけを頼りに自力で書き、模範解答とセルフチェックで答え合わせ

## 収録レッスン（42）

学習順: HTML → CSS → JS → Git → TS → React → Next.js → RN → Python → SQL → Ruby/Rails

| ユニット | 数 | 内容 |
|---|---|---|
| HTML | 5 | 骨組み／見出しとリスト／リンクと画像／フォーム／構造化 |
| CSS | 3 | セレクタ／ボックスモデル／Flexbox |
| JavaScript | 3 | 変数と出力／if と function／イベント |
| Git | 3 | init・add・commit／status・diff・.gitignore／GitHubへpush |
| TypeScript | 4 | 型注釈／関数の型／interface／配列・アロー関数・ユニオン型 |
| React | 5 | コンポーネントとJSX／props／useState／リストとkey／フォームとミニToDo |
| Next.js | 4 | ファイルベースルーティング／Linkとlayout／"use client"／サーバーでのfetch |
| React Native | 3 | View・Text・StyleSheet／onPressとuseState／TextInput・FlatListでメモアプリ |
| Python | 4 | print・変数・f文字列／リストとfor／辞書と関数／importとライブラリ |
| SQL | 3 | SELECT・WHERE／ORDER BY・GROUP BY／JOINと書き込み系 |
| Ruby / Rails | 5 | puts・変数・式展開／配列とブロック／シンボル・ハッシュ・クラス／RailsのMVC／ActiveRecordとSQL |

## プレビュー実行エンジン

- TS/React/Next: コードをブラウザ内でBabel変換して実行。import / export default は本物の書き方のまま打てる（実行時に自動処理）
- Next.jsのasyncサーバーコンポーネントは疑似実行（awaitして描画）。データ取得レッスンはjsonplaceholderの実APIを使用
- React Native: View/Text/Button/TextInput/FlatList等をWebで再現するシム＋スマホ枠シミュレーターで実行
- Git: コマンドの動きを再現する内蔵ターミナル・シミュレーター（オフライン動作、init/add/commit/status/diff/log/remote/push対応）
- Python: Pyodide（WASM版の本物のPython）をブラウザ内で実行。「▶ 実行」ボタン起動（初回読み込み約10秒）
- SQL: sql.js（WASM版の本物のSQLite）をブラウザ内で実行。レッスンごとにテーブルを自動セットアップし、結果を表で表示
- Ruby: ruby.wasm（WASM版の本物のCRuby 3.4）をブラウザ内で実行

## 開発者向け（中身を変更するとき）

ソースは `src/` に分割されている（index.html / style.css / lessons1〜5.js / reviews.js / app.js）。
編集後に `python build.py` を実行すると、自己完結型の `index.html` が再生成される。
レッスン追加は lessons*.js に追記するだけ（エンジン変更不要）。

## 進捗

ブラウザ（localStorage）に自動保存。サイドバー下の「進捗をリセット」で初期化できる。
ファイルの置き場所ごとに進捗は別管理なので、普段使うコピーは1つに決めるのがおすすめ。
