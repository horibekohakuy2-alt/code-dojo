// 教材データ(4/4): Git / Python / SQL

const GIT_NOTE = 'プレビューはGitの動きを再現するシミュレーター（オフラインで動作）。本物のGitはターミナルで動きますが、コマンドと出力の読み方はここで完全に身につきます。';
const PY_NOTE = 'ブラウザ内で本物のPython（Pyodide）を実行します（要ネット接続）。「▶ 実行」ボタンを押すと結果が表示されます。初回は読み込みに10秒ほどかかります。';
const SQL_NOTE = 'ブラウザ内で本物のデータベース（SQLite）を実行します（要ネット接続）。「▶ 実行」ボタンで結果表が表示されます。';

LESSONS.push(
  // ================= Git =================
  {
    id: "git-01",
    unit: "git",
    title: "バージョン管理とは — init / add / commit",
    previewMode: "term",
    scaffoldNote: GIT_NOTE + " 今回は「index.html と style.css を作った直後」のプロジェクトを想定しています。",
    termSetup: { untracked: ["index.html", "style.css"] },
    explanation: `
<h3>「最終版_v2_本当に最終.zip」問題を解決する道具</h3>
<p>コードを書いていると必ず「昨日の状態に戻したい」「どこを変えたか分からなくなった」が起きます。<strong>Git</strong>は、プロジェクトの歴史を丸ごと記録して<strong>いつでも任意の時点に戻れる</strong>ようにする道具（バージョン管理システム）です。世界中の開発現場とAI協働開発の大前提であり、言語ではありませんが<strong>言語と同じくらい必須</strong>です。</p>

<h3>Gitの世界観 — 3つの場所</h3>
<pre><code>作業フォルダ ──(git add)──→ ステージ ──(git commit)──→ 履歴
（編集する場所）      （記録する変更を選ぶ台）      （セーブデータ集）</code></pre>
<ul>
  <li><code>git init</code> — このフォルダをGit管理下に置く（プロジェクト開始時に1回だけ）</li>
  <li><code>git add ファイル名</code>（または <code>git add .</code> で全部）— 変更をステージに載せる</li>
  <li><code>git commit -m "メッセージ"</code> — ステージの内容を<strong>セーブポイントとして記録</strong>する</li>
  <li><code>git status</code> — 今どのファイルがどの状態かを確認する（迷ったらまずこれ）</li>
  <li><code>git log --oneline</code> — セーブポイントの一覧を見る</li>
</ul>

<h3>なぜ2段階（add → commit）なのか</h3>
<p>「変更した10ファイルのうち、この3つだけを1つのセーブにまとめたい」を可能にするためです。addは「今回のセーブに含めるものを選ぶ」、commitは「選んだものを確定する」。レジのカゴ（add）と会計（commit）の関係です。</p>
<div class="tip">💡 コミットメッセージは「何をしたか」を一言で（例: "ヘッダーのデザインを修正"）。未来の自分とチームへの手紙です。AIにコードを書かせたときも、区切りごとにcommitしておけば「AIが壊す前」にいつでも戻れます。</div>
`,
    model: `git init
git status
git add .
git status
git commit -m "自己紹介ページを作成"
git log --oneline`,
    challenge: {
      spec: "新しいプロジェクトをGit管理下に置き、最初のセーブポイントを作ってください。<br>・Git管理を開始する<br>・状態を確認してから、すべての変更をステージに載せる<br>・「最初のコミット」というメッセージでコミット<br>・履歴を一覧表示して確認",
      allowed: ["git init", "git status", "git add .", "git commit -m \"...\"", "git log --oneline"],
      model: `git init
git status
git add .
git commit -m "最初のコミット"
git log --oneline`,
      checklist: [
        "add（カゴに入れる）とcommit(会計)の2段階の意味を説明できる",
        "git statusで、add前後の状態の違いをシミュレーターで確認した",
        "コミットメッセージを「何をしたか」が分かる日本語で書いた",
      ],
    },
  },
  {
    id: "git-02",
    unit: "git",
    title: "日常サイクル — status / diff / .gitignore",
    previewMode: "term",
    scaffoldNote: GIT_NOTE + " 今回は「一度コミット済みのプロジェクトで、index.html を編集した直後」を想定しています。",
    termSetup: {
      inited: true,
      committed: ["style.css"],
      modified: ["index.html"],
      commits: [{ hash: "e7f8a9b", msg: "自己紹介ページを作成" }],
    },
    explanation: `
<h3>開発の日常は「編集 → 確認 → add → commit」の繰り返し</h3>
<p>Gitの日常はこの4拍子のループです。1機能できたらcommit、バグを直したらcommit。<strong>細かくセーブするほど、戻れる地点が増えます</strong>。</p>
<pre><code>コードを編集
  → git status   （何が変わった？）
  → git diff     （どこが変わった？ 行単位で確認）
  → git add .
  → git commit -m "変更内容"</code></pre>

<h3>git diff の読み方</h3>
<pre><code>- &lt;p&gt;準備中です&lt;/p&gt;        ← 「-」の行: 削除された行（赤）
+ &lt;p&gt;プロフィール公開！&lt;/p&gt;  ← 「+」の行: 追加された行（緑）</code></pre>
<p>この「-」「+」の差分表記は、GitHubのコードレビュー画面でも、AIが提案する修正の表示でも、<strong>世界共通の記法</strong>です。読めるだけで開発の解像度が一気に上がります。</p>

<h3>.gitignore — 記録してはいけないものを除外する</h3>
<p>プロジェクト直下に <code>.gitignore</code> というファイルを作り、除外したいものを書きます:</p>
<pre><code>node_modules/   ← 巨大な外部ライブラリ置き場（復元可能なので不要）
.env            ← APIキーなどの秘密情報（絶対に公開してはいけない）</code></pre>
<div class="tip">⚠️ <strong>.envの除外は事故防止の生命線です。</strong> AIキーをGitHubに誤公開して不正利用される事故が実際に多発しています。AI開発を始めるあなたには特に重要な1行です。</div>
`,
    model: `git status
git diff
git add index.html
git commit -m "プロフィール文を更新"
git status
git log --oneline`,
    challenge: {
      spec: "編集済みのファイルを、差分確認してからコミットしてください。<br>・状態確認 → 差分確認 → ステージ → 「文章を修正」というメッセージでコミット<br>・最後に履歴と状態を確認（working tree clean になっているか）",
      allowed: ["git status", "git diff", "git add index.html（または .）", "git commit -m \"...\"", "git log --oneline"],
      model: `git status
git diff
git add .
git commit -m "文章を修正"
git log --oneline
git status`,
      checklist: [
        "diffの「-」「+」がそれぞれ削除行・追加行だと説明できる",
        "コミット後にstatusが「working tree clean」になることを確認した",
        ".gitignoreに.envを書くべき理由（秘密情報の流出防止）を説明できる",
      ],
    },
  },
  {
    id: "git-03",
    unit: "git",
    title: "GitHubへ公開 — remote / push",
    previewMode: "term",
    scaffoldNote: GIT_NOTE + " 今回は「コミット済みのプロジェクトを、GitHubに作った空のリポジトリへ公開する」場面を想定しています。",
    termSetup: {
      inited: true,
      committed: ["index.html", "style.css", "README.md"],
      commits: [
        { hash: "e7f8a9b", msg: "自己紹介ページを作成" },
        { hash: "c4d5e6f", msg: "READMEを追加" },
      ],
    },
    explanation: `
<h3>ローカルとリモート — 手元のPCと、クラウドの保管庫</h3>
<p>ここまでの履歴はすべて<strong>自分のPCの中（ローカル）</strong>にあります。これを<strong>GitHub（リモート）</strong>にアップロードすると: ①PCが壊れても安全 ②URLひとつで作品を公開できる ③チームやAIエージェントと共同作業できる、ようになります。</p>
<p><strong>就活では、GitHubアカウントがそのままポートフォリオ（作品集）になります。</strong>「コードが読める」証明として、企業の採用担当が実際に見る場所です。</p>

<h3>公開は2コマンド</h3>
<pre><code>git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main</code></pre>
<ul>
  <li><code>remote add origin URL</code> — 「originという名前でこのURLの保管庫を登録」（最初に1回だけ）</li>
  <li><code>push</code> — ローカルの履歴をリモートへ送る。<code>-u origin main</code> は初回のみの儀式で、<strong>2回目以降は git push だけ</strong>でOK</li>
</ul>

<h3>逆方向と複製</h3>
<ul>
  <li><code>git pull</code> — リモートの新しい変更を手元に取り込む（pushの逆）</li>
  <li><code>git clone URL</code> — リモートのプロジェクトを丸ごと手元に複製（他人のコードやAIのサンプルを動かすときの入口）</li>
</ul>
<div class="tip">💡 リポジトリのトップに表示される README.md は「作品の顔」。何を作ったか・どう動かすかを書いておくと、採用担当にもAIにも伝わるプロジェクトになります。このCode Dojo自体にもREADMEがあります。</div>
`,
    model: `git log --oneline
git remote add origin https://github.com/kohaku/portfolio.git
git push -u origin main
git push`,
    challenge: {
      spec: "自分のポートフォリオをGitHubに公開してください。<br>・履歴を確認<br>・https://github.com/kohaku/my-site.git をoriginとして登録<br>・初回push（-u origin main付き）<br>・もう一度pushして「Everything up-to-date」を確認",
      allowed: ["git log --oneline", "git remote add origin URL", "git push -u origin main", "git push"],
      model: `git log --oneline
git remote add origin https://github.com/kohaku/my-site.git
git push -u origin main
git push`,
      checklist: [
        "remote add（保管庫の登録）とpush（送信）の役割の違いを説明できる",
        "2回目のpushに -u origin main が不要な理由を説明できる",
        "pushとpullの方向の違い（送る/取り込む）を説明できる",
      ],
    },
  },

  // ================= Python =================
  {
    id: "py-01",
    unit: "py",
    title: "Pythonへようこそ — print・変数・f文字列",
    previewMode: "py",
    scaffoldNote: PY_NOTE,
    filename: "main.py",
    explanation: `
<h3>PythonはAI時代の共通語</h3>
<p>機械学習・データ分析・AIエージェント開発は、事実上<strong>Python一択</strong>です。あなたのAI学習・AIサークル・大学の授業・基本情報、すべてに直結します。そして朗報——<strong>JS/TSを学んだあなたなら、Pythonは「対応表の置き換え」で読めます</strong>。</p>
<table>
<tr><th>JavaScript / TS</th><th>Python</th></tr>
<tr><td>console.log(x)</td><td>print(x)</td></tr>
<tr><td>const name = "コハク"</td><td>name = "コハク"（宣言キーワード不要）</td></tr>
<tr><td>// コメント</td><td># コメント</td></tr>
<tr><td>{ } でブロック</td><td><strong>インデントがブロック</strong>（後述）</td></tr>
<tr><td>\`&#36;{name}さん\`</td><td>f"{name}さん"</td></tr>
</table>

<h3>最大の特徴: インデントが文法</h3>
<p>JSではインデントは「読みやすさのため」でしたが、Pythonでは<strong>字下げそのものがブロックの区切り</strong>です。だからPythonのコードは誰が書いても構造が見た目に表れます（AIのコードも読みやすい）。ズレるとエラーになるので、<strong>半角スペース4つ</strong>で統一します。</p>

<h3>f文字列 — Python版テンプレートリテラル</h3>
<pre><code>name = "コハク"
print(f"{name}さんは{20 + 1}歳になります")
# → コハクさんは21歳になります</code></pre>
<p>先頭に <code>f</code> を付けた文字列の中では、<code>{ }</code> に変数や式を埋め込めます。TS-04で予告した「読めるべき書き方」のPython版で、実務・AI生成コードのほぼ100%がこれを使います。</p>
<div class="tip">💡 割り算 <code>/</code> の結果は常に小数（3000 / 4 → 750.0）になります。整数のまま割りたいときは <code>//</code>（切り捨て割り算）。JSとの小さな違いですが、出力を見て「あれ、.0が付いてる？」と気づけたら一人前です。</div>
`,
    model: `name = "コハク"
age = 20

print("こんにちは、" + name + "さん")
print(f"{name}さんは{age}歳、来年は{age + 1}歳")

# インデントの練習: ifのブロックは4スペース下げる
if age >= 18:
    print("成人です")`,
    challenge: {
      spec: "割り勘計算のPython版を書いてください（JS-01の挑戦課題と同じアプリ、3言語目！）。<br>・total = 3000、people = 4 を定義<br>・1人あたりの金額を計算して変数に入れる<br>・f文字列で「1人あたり750.0円です」と出力<br>・さらに、if で total が 2000 以上なら「割り勘推奨」と出力（インデント4スペース）",
      allowed: ["変数 = 値", "print()", "f\"{変数}\"", "/（割り算）", "if 条件:", "インデント4スペース"],
      model: `total = 3000
people = 4
per_person = total / people

print(f"1人あたり{per_person}円です")

if total >= 2000:
    print("割り勘推奨")`,
      checklist: [
        "宣言キーワード（const等）なしで変数を作れた",
        "f文字列の{ }に変数を埋め込めた",
        "ifの中身を4スペースのインデントで書けた（Pythonではこれが文法）",
      ],
    },
  },
  {
    id: "py-02",
    unit: "py",
    title: "リストとfor — データの列を処理する",
    previewMode: "py",
    scaffoldNote: PY_NOTE,
    filename: "main.py",
    explanation: `
<h3>リスト = JSの配列</h3>
<pre><code>scores = [72, 85, 91, 68]
scores[0]      # 72（0始まりもJSと同じ）
len(scores)    # 4（JSの .length は、Pythonでは len() 関数）</code></pre>

<h3>for — Pythonの繰り返しは「1つずつ取り出す」</h3>
<pre><code>for s in scores:
    print(f"{s}点")   # インデントの中が繰り返される</code></pre>
<p>読み方: 「scoresから1つずつ取り出してsと呼び、ブロックを実行」。回数で回したいときは <code>for i in range(5):</code>（0〜4）。JSのfor文より簡潔で、<strong>データ処理が得意なPythonらしさ</strong>が出る文法です。</p>

<h3>リスト内包表記 — PythonのfilterとmapはこれでⅠ行</h3>
<pre><code>passed = [s for s in scores if s >= 80]
# JSで書くと: scores.filter((s) => s >= 80)
doubled = [s * 2 for s in scores]
# JSで書くと: scores.map((s) => s * 2)</code></pre>
<p>読み方のコツは<strong>後ろから</strong>: 「scoresの各sについて（for s in scores）、80以上なら（if）、sを集める（先頭のs）」。AIが書くPythonコードの最頻出パターンなので、<strong>書けなくても読める</strong>を必ず達成してください。</p>
<div class="tip">💡 集計の三種の神器: <code>sum(リスト)</code>（合計）、<code>max(リスト)</code>（最大）、<code>min(リスト)</code>（最小）。JSでは一手間かかる処理が、Pythonでは組み込み関数1つ。この「データ処理の楽さ」がAI分野でPythonが選ばれる理由です。</div>
`,
    model: `scores = [72, 85, 91, 68]

for s in scores:
    print(f"{s}点")

passed = [s for s in scores if s >= 80]
print(f"合格: {passed}")

print(f"合計: {sum(scores)}")
print(f"平均: {sum(scores) / len(scores)}")`,
    challenge: {
      spec: "今週の学習時間を集計してください。<br>・hours = [2, 1, 4, 4, 3] を定義<br>・forで1日ずつ「◯時間」と出力<br>・リスト内包表記で「3時間以上の日」だけのリストを作って出力<br>・sumで合計を「週合計: ◯時間」と出力",
      allowed: ["リスト [ ]", "for x in リスト:", "リスト内包表記 [x for x in xs if 条件]", "sum()", "len()", "print(f\"...\")"],
      model: `hours = [2, 1, 4, 4, 3]

for h in hours:
    print(f"{h}時間")

focused = [h for h in hours if h >= 3]
print(f"集中日: {focused}")

print(f"週合計: {sum(hours)}時間")`,
      checklist: [
        "for文のブロックをインデントで書けた",
        "リスト内包表記を「後ろから」読んで意味を説明できる（JSのfilterに対応）",
        "sum/lenをJSの書き方と対比して説明できる",
      ],
    },
  },
  {
    id: "py-03",
    unit: "py",
    title: "辞書と関数 — def・型ヒント",
    previewMode: "py",
    scaffoldNote: PY_NOTE,
    filename: "main.py",
    explanation: `
<h3>辞書（dict）= JSのオブジェクト</h3>
<pre><code>me = {"name": "コハク", "age": 20}
me["name"]        # 取り出しは [キー]（JSのドットではなく角カッコ）
"hobby" in me     # キーの存在確認 → False</code></pre>
<p>JSのオブジェクトとほぼ同じですが、<strong>キーを文字列で書く・取り出しは角カッコ</strong>が違いです。APIのデータ（JSON）はPythonでは辞書になります。</p>

<h3>関数は def — そして型ヒント</h3>
<pre><code>def introduce(user: dict) -> str:
    return f"{user['name']}さん"</code></pre>
<ul>
  <li><code>def 名前(引数):</code> — JSのfunctionに相当。ブロックはやはりインデント</li>
  <li><code>user: dict</code> と <code>-&gt; str</code> — <strong>型ヒント</strong>。TSの型注釈のPython版（引数: 型、戻り値は -&gt;）</li>
  <li>デフォルト引数 <code>def f(goal=80):</code> もTSと同じ発想</li>
</ul>
<p>Pythonの型ヒントは「飾り」で実行時には無視されますが（TSと同じくチェックは道具の仕事）、<strong>実務・AI生成コードでは書くのが標準</strong>。TSを学んだあなたはもう読めます。</p>
<div class="tip">💡 f文字列の中で辞書を使うときは <code>f"{user['name']}"</code> と、外側と違う種類のクォートを使います（外が " なら中は '）。細かいですが、エラー原因の定番です。</div>
`,
    model: `def introduce(user: dict) -> str:
    if "hobby" in user:
        return f"{user['name']}（{user['age']}歳）趣味: {user['hobby']}"
    return f"{user['name']}（{user['age']}歳）"

me = {"name": "コハク", "age": 20, "hobby": "AI"}
friend = {"name": "タロウ", "age": 21}

print(introduce(me))
print(introduce(friend))`,
    challenge: {
      spec: "TOEFL判定関数のPython版を書いてください（JS-02 → TS-02 → 今回で3言語制覇！）。<br>・def check_score(score: int, goal: int = 80) -> str: を定義<br>・goal以上なら「目標達成！」、未満なら「あと◯点」を返す<br>・check_score(53) と check_score(53, 60) の結果を両方print",
      allowed: ["def 名前(引数: 型) -> 型:", "デフォルト引数 goal=80", "if / return", "f\"...\"", "print()"],
      model: `def check_score(score: int, goal: int = 80) -> str:
    if score >= goal:
        return "目標達成！"
    return f"あと{goal - score}点"

print(check_score(53))
print(check_score(53, 60))`,
      checklist: [
        "defと型ヒント（: int, -> str）をTSの型注釈と対比して説明できる",
        "関数ブロック・ifブロックの2段インデントが正しく書けた",
        "「あと27点」「あと7点」と出力された",
      ],
    },
  },
  {
    id: "py-04",
    unit: "py",
    title: "import とライブラリ — Pythonの真の武器",
    previewMode: "py",
    scaffoldNote: PY_NOTE,
    filename: "main.py",
    explanation: `
<h3>Pythonの強さ = ライブラリ生態系</h3>
<p>Python本体はシンプルですが、<strong>世界中の専門家が作った道具箱（ライブラリ）</strong>をimportで呼び出せることが最大の武器です。AI分野の地図を頭に入れておきましょう:</p>
<table>
<tr><th>名前</th><th>役割</th></tr>
<tr><td>NumPy / pandas</td><td>数値計算・表データ処理（データ分析の土台）</td></tr>
<tr><td>matplotlib</td><td>グラフ描画</td></tr>
<tr><td>scikit-learn</td><td>機械学習の入門定番</td></tr>
<tr><td>PyTorch</td><td>深層学習（研究・実務の主流）</td></tr>
<tr><td>FastAPI</td><td>PythonでAPIサーバーを作る（Next.jsの相棒になれる）</td></tr>
</table>
<p>これらは「pip install」で追加する外部ライブラリです。<strong>AIサークルの勉強会ネタにもそのまま使えます</strong>。</p>

<h3>まずは標準ライブラリ（インストール不要）から</h3>
<pre><code>import statistics                # 統計の道具箱を持ってくる
statistics.mean([1, 2, 3])       # 平均 → 2
statistics.median([1, 2, 100])   # 中央値 → 2

import random
random.choice(["A", "B", "C"])   # ランダムに1つ選ぶ
random.randint(1, 6)             # 1〜6の整数（サイコロ）</code></pre>
<p><code>import x</code> して <code>x.関数()</code> で使う——JSの import と同じ発想です。「モジュール名.機能名」と読みます。</p>
<div class="tip">💡 平均（mean）と中央値（median）の違いは基本情報にも出る基礎統計です。[1, 2, 100]のような外れ値があるとき、平均は34.3に引きずられるが中央値は2のまま——「どちらを見るべきか」を考えるのがデータ分析の入口です。</div>
`,
    model: `import statistics

scores = [72, 85, 91, 68, 88]

print(f"平均: {statistics.mean(scores)}")
print(f"中央値: {statistics.median(scores)}")
print(f"最大: {max(scores)} / 最小: {min(scores)}")

import random

subject = random.choice(["AI", "英語", "プログラミング"])
print(f"今日のガチャ: {subject}を勉強しよう！")`,
    challenge: {
      spec: "「今日の学習ガチャ」を作ってください。<br>・statisticsをimportし、hours = [2, 1, 4, 4, 3] の平均を「平均◯時間」と出力<br>・randomをimportし、random.choiceで科目リストから1つ、random.randintで15〜60分を選ぶ<br>・「今日は◯◯を◯分やろう！」と出力（実行するたび変わる）",
      allowed: ["import statistics / random", "statistics.mean()", "random.choice(リスト)", "random.randint(a, b)", "print(f\"...\")"],
      model: `import statistics
import random

hours = [2, 1, 4, 4, 3]
print(f"平均{statistics.mean(hours)}時間")

subject = random.choice(["AI", "英語", "プログラミング", "タイピング"])
minutes = random.randint(15, 60)
print(f"今日は{subject}を{minutes}分やろう！")`,
      checklist: [
        "importの意味（道具箱を持ってくる）と「モジュール名.関数名」の読み方を説明できる",
        "実行するたびに結果が変わることを確認した（randomの働き）",
        "NumPy/pandas/PyTorchが何の道具か、ざっくり言える（AI学習への地図）",
      ],
    },
  },

  // ================= SQL =================
  {
    id: "sql-01",
    unit: "sql",
    title: "SELECT と WHERE — データベースに質問する",
    previewMode: "sql",
    scaffoldNote: SQL_NOTE + " 学習記録テーブル study_log（id, subject, hours, day の4列・7行）が準備済みです。",
    filename: "query.sql",
    seedSql: "CREATE TABLE study_log (id INTEGER, subject TEXT, hours REAL, day TEXT); INSERT INTO study_log VALUES (1,'AI',2,'月'),(2,'プログラミング',1,'火'),(3,'AI',2,'水'),(4,'プログラミング',4,'木'),(5,'英語',3,'金'),(6,'AI',3,'土'),(7,'英語',2,'日');",
    explanation: `
<h3>データベース — アプリの裏には必ずこれがいる</h3>
<p>ToDoの項目、ユーザー情報、投稿…アプリのデータは<strong>データベース（DB）</strong>に保存されます。DBの中身は<strong>テーブル</strong>（Excelのシートのようなもの）で、横1行が1件のデータ（<strong>行/レコード</strong>）、縦の項目が<strong>列/カラム</strong>です。今回使うテーブル:</p>
<pre><code>study_log（学習記録）
id | subject          | hours | day
1  | AI               | 2.0   | 月
2  | プログラミング   | 1.0   | 火
...（全7行）</code></pre>

<h3>SQLは「何が欲しいか」を書く言語</h3>
<p>JSやPythonは「どう処理するか」の手順を書きますが、SQLは<strong>欲しい結果の条件だけを書く</strong>宣言型言語です。基本形はこれだけ:</p>
<pre><code>SELECT 列名, 列名    ← どの列が欲しい？（* なら全部）
FROM テーブル名      ← どのテーブルから？
WHERE 条件;          ← どの行だけ？（省略なら全行）</code></pre>
<ul>
  <li>文字列は<strong>シングルクォート</strong>: <code>WHERE subject = 'AI'</code></li>
  <li>比較: <code>=</code>（SQLでは1個で「等しい」！）、<code>&gt;=</code>、<code>AND</code>/<code>OR</code></li>
  <li>文末に <code>;</code>。大文字小文字は区別されないが、<strong>命令を大文字で書く</strong>のが読みやすさの慣習</li>
</ul>
<div class="tip">💡 Next.js-04でfetchしたAPIの裏側では、サーバーがまさにこういうSQLを実行してJSONを返しています。「フロント（React）→ API（Next.js）→ DB（SQL）」——これであなたはWebアプリの全層を貫通したことになります。</div>
`,
    model: `SELECT * FROM study_log;

SELECT subject, hours
FROM study_log
WHERE subject = 'AI';

SELECT subject, hours, day
FROM study_log
WHERE hours >= 3;`,
    challenge: {
      spec: "study_logテーブルに3つの質問をしてください。<br>・全列・全行を表示<br>・「英語」の行だけ、subjectとhours列を表示<br>・2時間以上「かつ」subjectが'AI'の行を表示（ANDを使う）",
      allowed: ["SELECT 列名 / *", "FROM study_log", "WHERE", "=（等しい）", ">=", "AND", "'文字列'", ";"],
      model: `SELECT * FROM study_log;

SELECT subject, hours
FROM study_log
WHERE subject = '英語';

SELECT *
FROM study_log
WHERE hours >= 2 AND subject = 'AI';`,
      checklist: [
        "SELECT / FROM / WHERE の3行構造を説明できる",
        "SQLの = はJSの === と違い1個であることに注意した",
        "文字列をシングルクォートで書いた",
      ],
    },
  },
  {
    id: "sql-02",
    unit: "sql",
    title: "並べ替えと集計 — ORDER BY・GROUP BY",
    previewMode: "sql",
    scaffoldNote: SQL_NOTE + " 前回と同じ study_log テーブル（7行）が準備済みです。",
    filename: "query.sql",
    seedSql: "CREATE TABLE study_log (id INTEGER, subject TEXT, hours REAL, day TEXT); INSERT INTO study_log VALUES (1,'AI',2,'月'),(2,'プログラミング',1,'火'),(3,'AI',2,'水'),(4,'プログラミング',4,'木'),(5,'英語',3,'金'),(6,'AI',3,'土'),(7,'英語',2,'日');",
    explanation: `
<h3>並べ替え: ORDER BY と 上位だけ: LIMIT</h3>
<pre><code>SELECT * FROM study_log
ORDER BY hours DESC   ← hoursの大きい順（DESC=降順、ASC=昇順）
LIMIT 3;              ← 上位3行だけ</code></pre>
<p>「ランキング上位N件」はこの2つの組み合わせ。あらゆるアプリの「人気順」「新着順」の正体です。</p>

<h3>集計関数 — 行をまとめて1つの数字に</h3>
<ul>
  <li><code>COUNT(*)</code> — 行数を数える</li>
  <li><code>SUM(hours)</code> / <code>AVG(hours)</code> — 合計・平均</li>
  <li><code>AS 別名</code> — 結果の列に名前をつける（読みやすさの必須マナー）</li>
</ul>

<h3>GROUP BY — 「〜ごとに」集計する</h3>
<pre><code>SELECT subject, SUM(hours) AS total
FROM study_log
GROUP BY subject;     ← subjectごとにまとめて、それぞれSUMする</code></pre>
<p>読み方: 「<strong>科目ごとに</strong>、合計時間を出す」。GROUP BYを見たら「〜ごとに」と訳すのがコツです。売上を「店舗ごとに」、投稿を「ユーザーごとに」——実務のレポート作成はほぼこれで、<strong>Pythonのpandasにも同名の概念（groupby）</strong>がそのまま登場します。</p>
<div class="tip">💡 実行順序のイメージ: FROM（テーブルを持ってくる）→ WHERE（行を絞る）→ GROUP BY（まとめる）→ SELECT（列を選ぶ）→ ORDER BY（並べる）。書く順と実行される順が違う、と知っているとSQLの読解が一気に楽になります。</div>
`,
    model: `SELECT * FROM study_log
ORDER BY hours DESC
LIMIT 3;

SELECT COUNT(*) AS days, SUM(hours) AS total
FROM study_log;

SELECT subject, SUM(hours) AS total, AVG(hours) AS average
FROM study_log
GROUP BY subject
ORDER BY total DESC;`,
    challenge: {
      spec: "学習記録を分析してください。<br>・勉強時間の少ない順に並べて上位2行を表示（ORDER BY + LIMIT）<br>・全体の平均時間を average という列名で表示（AVG + AS）<br>・科目ごとの回数（COUNT）と合計（SUM）を、合計の多い順に表示",
      allowed: ["ORDER BY 列 ASC/DESC", "LIMIT n", "COUNT(*) / SUM() / AVG()", "AS 別名", "GROUP BY", ";"],
      model: `SELECT * FROM study_log
ORDER BY hours ASC
LIMIT 2;

SELECT AVG(hours) AS average
FROM study_log;

SELECT subject, COUNT(*) AS times, SUM(hours) AS total
FROM study_log
GROUP BY subject
ORDER BY total DESC;`,
      checklist: [
        "ASC（昇順）とDESC（降順）を使い分けた",
        "GROUP BYを「〜ごとに」と訳して説明できる",
        "集計結果にASで名前をつけた",
      ],
    },
  },
  {
    id: "sql-03",
    unit: "sql",
    title: "JOIN — 分かれたテーブルをつなぐ（卒業レッスン）",
    previewMode: "sql",
    scaffoldNote: SQL_NOTE + " users（id, name の2人）と posts（id, user_id, content の3件）の2テーブルが準備済みです。",
    filename: "query.sql",
    seedSql: "CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1,'コハク'),(2,'タロウ'); CREATE TABLE posts (id INTEGER, user_id INTEGER, content TEXT); INSERT INTO posts VALUES (1,1,'HTML完了！'),(2,1,'SQLたのしい'),(3,2,'React学習中');",
    explanation: `
<h3>なぜテーブルを分けるのか</h3>
<p>投稿テーブルに毎回ユーザー名を書き込むと、名前変更のとき全投稿を直す羽目になります。そこで<strong>ユーザーはusersテーブルに1回だけ書き、投稿にはその番号（user_id）だけを持たせる</strong>——これがDB設計の基本思想（正規化）です。</p>
<pre><code>users                 posts
id | name             id | user_id | content
1  | コハク           1  | 1       | HTML完了！
2  | タロウ           2  | 1       | SQLたのしい
                      3  | 2       | React学習中</code></pre>
<p>この user_id のような「他のテーブルの行を指す番号」を<strong>外部キー</strong>と呼びます。</p>

<h3>JOIN — 貼り合わせて元に戻す</h3>
<pre><code>SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id;</code></pre>
<p>読み方: 「postsに、usersを貼り合わせる。<strong>貼り合わせの条件は</strong> postsのuser_idとusersのidが一致すること（ON）」。列名は <code>テーブル名.列名</code> で区別します。<strong>実務のSQLの9割はJOINを含みます</strong>——読めれば、AIが生成するどんなクエリも骨格が掴めます。</p>

<h3>読み方だけ知っておく: 書き込み系3兄弟</h3>
<pre><code>INSERT INTO posts VALUES (4, 2, '新しい投稿');   ← 追加
UPDATE users SET name = '新名前' WHERE id = 1;    ← 更新
DELETE FROM posts WHERE id = 4;                    ← 削除</code></pre>
<div class="tip">⚠️ UPDATEとDELETEの<strong>WHEREを忘れると全行が対象</strong>になります。実務での大事故ワースト1位。AIが生成したSQLを実行する前に「WHEREはあるか？」を見る習慣を、今日から持ってください。——これで全ユニット卒業です。おめでとう！🎓</div>
`,
    model: `SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id;

INSERT INTO posts VALUES (4, 2, 'SQL卒業！');

SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id;`,
    challenge: {
      spec: "卒業課題: 投稿アプリのデータを操作してください。<br>・INSERTで自分の新しい投稿を追加（id=4, user_id=1, 内容は自由）<br>・JOINで「名前 + 投稿内容」の一覧を表示（追加した投稿も出るはず）<br>・WHEREを付けたJOINで、コハク（users.name = 'コハク'）の投稿だけに絞る",
      allowed: ["INSERT INTO posts VALUES (...)", "SELECT テーブル.列", "FROM / JOIN / ON", "WHERE", ";"],
      model: `INSERT INTO posts VALUES (4, 1, '全カリキュラム完走！');

SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id;

SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id
WHERE users.name = 'コハク';`,
      checklist: [
        "外部キー（user_id）が「他テーブルの行を指す番号」だと説明できる",
        "JOINのONを「貼り合わせの条件」と訳して説明できる",
        "🎓 UPDATE/DELETEでWHEREを忘れる事故の危険性を説明できたら、全37レッスン完走！おめでとうございます！",
      ],
    },
  }
);
