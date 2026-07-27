// 力試し（各ユニット末の総合復習）データ
// 目的: エビングハウスの忘却曲線対策。習得した知識を、少し時間をおいて・複数概念を
//       組み合わせて・過去の言語も混ぜて出し直すことで定着させる。
// problem.type:
//   "write" … お題＋ヒントだけで自分で書く（既定）。previewModeのエンジンで動かして確認
//   "read"  … コードを読んで出力予想・間違い探し。まず自分で書いてから答え合わせ
// ※ HTML/CSS/JS/TS/React/Next/RNはWeb系エンジンで複数言語を混ぜて動かせる。
//   Git/Python/SQLはエンジンが分かれるため、その言語内で書く＋読んで答えるで補う。

const REVIEWS = [
  // ================= HTML 力試し =================
  {
    id: "review-html",
    unit: "html",
    title: "HTML 力試し",
    intro:
      "HTML編の総仕上げです。骨組み・見出し・リスト・リンク・画像・フォーム・構造化タグを、" +
      "今度は<strong>組み合わせて</strong>使います。手本はありません——お題とヒントだけを頼りに書き、" +
      "「▶ 実行」で結果を確かめましょう。少し手が止まるくらいがちょうどいい負荷です。",
    problems: [
      {
        type: "write",
        previewMode: "html",
        prompt:
          "自己紹介ページを<strong>構造化タグ</strong>で組み立ててください。<br>" +
          "・全体を <code>header</code> / <code>main</code> / <code>footer</code> の3つに分ける<br>" +
          "・header の中に <code>h1</code> で名前<br>" +
          "・main の中に <code>h2</code>「できること」＋ <code>ul</code> で3項目のリスト<br>" +
          "・footer の中に <code>p</code> で著作権表示（例: © 2026 …）",
        allowed: ["<header>", "<main>", "<footer>", "<h1>", "<h2>", "<ul> / <li>", "<p>"],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>自己紹介</title>
</head>
<body>
  <header>
    <h1>コハク</h1>
  </header>
  <main>
    <h2>できること</h2>
    <ul>
      <li>HTMLでページの骨組みを作る</li>
      <li>CSSで見た目を整える</li>
      <li>JavaScriptで動きをつける</li>
    </ul>
  </main>
  <footer>
    <p>© 2026 コハク</p>
  </footer>
</body>
</html>`,
        checklist: [
          "header・main・footer の3つで全体を分けた",
          "main の中に h2 と ul（li 3つ）を入れた",
          "プレビューで 見出し→リスト→フッター の順に表示された",
        ],
      },
      {
        type: "write",
        previewMode: "html",
        prompt:
          "「お問い合わせフォーム」のあるページを作ってください。<br>" +
          "・<code>h1</code> でページタイトル<br>" +
          "・<code>form</code> の中に、<code>label</code> 付きの入力欄を2つ（名前・メール）<br>" +
          "・入力欄には <code>type</code> と <code>placeholder</code> を指定<br>" +
          "・最後に送信 <code>button</code>",
        allowed: ["<h1>", "<form>", "<label>", "<input>", "type属性", "placeholder属性", "<button>"],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>お問い合わせ</title>
</head>
<body>
  <h1>お問い合わせ</h1>
  <form>
    <label>お名前:
      <input type="text" placeholder="山田 太郎">
    </label>
    <label>メール:
      <input type="email" placeholder="you@example.com">
    </label>
    <button>送信</button>
  </form>
</body>
</html>`,
        checklist: [
          "input を label と組にして2つ置いた",
          "input に type（text / email）と placeholder をつけた",
          "プレビューに入力欄2つと送信ボタンが表示された",
        ],
      },
      {
        type: "read",
        code: `<h2>今日の予定<h2>
<p>まず英語を1時間<p>
<p>そのあとプログラミング</p>`,
        question:
          "このHTMLをブラウザで開くと、<strong>2行目以降まで全部が大きな見出しのように崩れて</strong>表示されます。" +
          "崩れる原因は2か所にあります。<strong>どこが・なぜ間違いか</strong>を説明し、正しく直したコードを書いてください。",
        answer:
          "1行目の <code>&lt;h2&gt;</code> と2行目の <code>&lt;p&gt;</code> の<strong>終了タグの「/」が抜けている</strong>のが原因です（正しくは <code>&lt;/h2&gt;</code> と <code>&lt;/p&gt;</code>）。",
        explanation:
          "<code>&lt;h2&gt;</code> はもう一度書いても「終了」ではなく「新しい見出しの開始」と解釈されます。閉じられないまま後ろの文章まで飲み込まれ、全体が見出し扱いになって表示が崩れます。" +
          "終了タグは必ず <code>&lt;/タグ名&gt;</code> のように<strong>スラッシュ付き</strong>で書く、が鉄則です。",
        checklist: [
          "崩れの原因が「終了タグの / 抜け」だと2か所とも見抜けた",
          "終了タグは </タグ名> と書く、と自分の言葉で説明できる",
        ],
      },
    ],
  },

  // ================= CSS 力試し =================
  {
    id: "review-css",
    unit: "css",
    title: "CSS 力試し",
    intro:
      "CSS編の総仕上げです。セレクタ・class・ボックスモデル・Flexbox を組み合わせ、" +
      "<strong>HTMLに見た目をつける</strong>練習をします。HTMLの復習も兼ねています。",
    problems: [
      {
        type: "write",
        previewMode: "html",
        prompt:
          "「重要なお知らせ」カードを作ってください。<br>" +
          "・<code>h1</code> を中央揃え（<code>text-align</code>）にする<br>" +
          "・<code>notice</code> という class を定義し、<strong>背景色・文字色・padding・border-radius</strong> を設定<br>" +
          "・その class をつけた <code>p</code> を1つ置く",
        allowed: ["<style>", "text-align", "background-color", "color", "padding", "border-radius", ".notice", 'class="notice"'],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>お知らせ</title>
  <style>
    h1 {
      text-align: center;
    }
    .notice {
      background-color: #dc2626;
      color: white;
      padding: 14px 18px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>掲示板</h1>
  <p class="notice">明日の勉強会は17時開始に変更します。</p>
</body>
</html>`,
        checklist: [
          "class をドット付き（.notice）で定義し、HTML側で class属性をつけた",
          "padding と border-radius でカードらしい見た目にした",
          "背景色が padding の分まで塗られているのを確認した",
        ],
      },
      {
        type: "write",
        previewMode: "html",
        prompt:
          "3枚の「学習メニュー」カードを<strong>横並び・中央</strong>に配置してください。<br>" +
          "・親に <code>display: flex</code>、<code>gap</code>、<code>justify-content: center</code><br>" +
          "・各カードに背景色・<code>padding</code>・<code>border</code>・<code>border-radius</code><br>" +
          "・カードの中身は「AI」「英語」「プログラミング」",
        allowed: ["display: flex", "gap", "justify-content: center", "background-color", "padding", "border", "border-radius", "<div class>"],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>学習メニュー</title>
  <style>
    .menu {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    .item {
      background-color: #dbeafe;
      padding: 24px;
      border: 1px solid #2563eb;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="menu">
    <div class="item">AI</div>
    <div class="item">英語</div>
    <div class="item">プログラミング</div>
  </div>
</body>
</html>`,
        checklist: [
          "display: flex を「親」(.menu)につけた（子ではなく）",
          "各カードに padding と border-radius をつけて箱にした",
          "3枚が横一列・中央に並んだ（プレビューで確認）",
        ],
      },
      {
        type: "read",
        code: `<style>
  .menu {
    gap: 16px;
  }
  .item {
    display: flex;
    background-color: #dbeafe;
    padding: 16px;
  }
</style>

<div class="menu">
  <div class="item">AI</div>
  <div class="item">英語</div>
  <div class="item">プログラミング</div>
</div>`,
        question:
          "カードを横並びにしたいのに、このコードでは<strong>縦に積まれたまま</strong>で、gapも効きません。" +
          "<strong>原因</strong>と<strong>直し方</strong>を説明してください（ヒント: display: flex を書く場所）。",
        answer:
          "<code>display: flex;</code> を<strong>子（.item）ではなく親（.menu）に</strong>書くのが正解です。gapも親側で初めて効きます。",
        explanation:
          "flexは「自分の<strong>子どもたち</strong>を並べる」命令なので、並べたい要素そのものではなく、その親につけます。" +
          "<code>.item</code> の display: flex は「.itemの中身を並べる」という意味にしかならず、カード同士の並びには影響しません。" +
          "レイアウトが効かないときは「つけた場所は親か？」を最初に疑う——AIが書いたCSSが崩れたときの定番チェックポイントです。",
        checklist: [
          "flexは「親」につけると子が横に並ぶ、と説明できる",
          ".menu側に display: flex と gap を移した正しいコードを書けた",
        ],
      },
    ],
  },

  // ================= JavaScript 力試し =================
  {
    id: "review-js",
    unit: "js",
    title: "JavaScript 力試し",
    intro:
      "JavaScript編の総仕上げです。変数・計算・条件分岐・関数・イベントを組み合わせ、" +
      "<strong>HTML/CSSと連動する「動くページ」</strong>を作ります。最後の1問は、コードを読んで結果を予想する問題です。",
    problems: [
      {
        type: "write",
        previewMode: "html",
        prompt:
          "「あと何日？」カウンターを表示してください。<br>" +
          "・<code>p id=\"out\"</code> を用意し、<code>class</code> で文字を大きく色付きに（CSS）<br>" +
          "・<code>const</code> で目標名（文字列）と残り日数（数値）を宣言<br>" +
          "・「TOEFLまであと30日！」の形の文字列を <code>+</code> で組み立て<br>" +
          "・<code>getElementById</code> で out に表示",
        allowed: ["<style>", "font-size", "color", ".big / class", '<p id="out">', "<script>", "const", "+（連結）", "getElementById().textContent"],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カウントダウン</title>
  <style>
    .big {
      font-size: 24px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <p id="out" class="big"></p>
  <script>
    const goal = "TOEFL";
    const days = 30;
    const message = goal + "まであと" + days + "日！";
    document.getElementById("out").textContent = message;
  </script>
</body>
</html>`,
        checklist: [
          "const で文字列と数値の変数を作り、+ で1つの文字列に連結した",
          "getElementById で id=out の要素に textContent を入れた",
          "CSS の class(.big) で文字を大きく色付きにできた",
        ],
      },
      {
        type: "write",
        previewMode: "html",
        prompt:
          "「いいね」ボタンを作ってください。<br>" +
          "・<code>button</code> と、件数を出す <code>p id=\"count\"</code><br>" +
          "・<code>let</code> で件数を0から用意<br>" +
          "・押すたびに件数を1増やして表示を更新（<code>addEventListener</code>）<br>" +
          "・10件に達したら文字に「大人気！」を足す（<code>if</code>）",
        allowed: ["<button>", '<p id="count">', "<script>", "let", "addEventListener", "if / else", "getElementById().textContent"],
        model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>いいね</title>
</head>
<body>
  <button id="btn">いいね</button>
  <p id="count">0 件</p>
  <script>
    let count = 0;
    const btn = document.getElementById("btn");
    const label = document.getElementById("count");
    btn.addEventListener("click", function () {
      count = count + 1;
      if (count >= 10) {
        label.textContent = count + " 件 — 大人気！";
      } else {
        label.textContent = count + " 件";
      }
    });
  </script>
</body>
</html>`,
        checklist: [
          "let の件数を addEventListener の中で count = count + 1 と増やした",
          "if / else で10件以上のときだけ表示を変えた",
          "ボタンを何度か押して、数が増え・10でメッセージが変わるのを確認した",
        ],
      },
      {
        type: "read",
        code: `function greet(name, hour) {
  let period = "";
  if (hour < 12) {
    period = "おはよう";
  } else {
    period = "こんにちは";
  }
  return period + "、" + name + "さん";
}

const msg = greet("コハク", 15);
document.getElementById("out").textContent = msg;`,
        question:
          "このコードを実行すると、画面（id=out）に<strong>何と表示される</strong>でしょうか。" +
          "頭の中で1行ずつ追って、表示される文字列を書いてください。",
        answer: "<code>こんにちは、コハクさん</code> と表示されます。",
        explanation:
          "呼び出しは <code>greet(\"コハク\", 15)</code> なので <code>hour</code> は 15。" +
          "<code>if (hour &lt; 12)</code> は「15 &lt; 12」＝ false なので <code>else</code> 側が動き、<code>period</code> は「こんにちは」になります。" +
          "最後に <code>period + \"、\" + name + \"さん\"</code> を組み立てて返すので、結果は「こんにちは、コハクさん」です。",
        checklist: [
          "hour=15 は if(hour < 12) が false なので else が動く、と追えた",
          "return で組み立てた文字列がそのまま textContent に入ると分かった",
        ],
      },
    ],
  },

  // ================= Git 力試し =================
  {
    id: "review-git",
    unit: "git",
    title: "Git 力試し",
    intro:
      "Git編の総仕上げです。init → add → commit の基本サイクル、日常の status / diff、" +
      "GitHubへの公開までを、<strong>指示どおりの順で自分の手で</strong>打てるか試します。" +
      "最後はstatusの出力を読み解く問題——実務で毎日やる作業です。",
    problems: [
      {
        type: "write",
        previewMode: "term",
        termSetup: { untracked: ["index.html", "style.css"] },
        prompt:
          "作りたての作品フォルダ（index.html と style.css がある）をGitで記録してください。<br>" +
          "・リポジトリを作る<br>" +
          "・状態を確認し、2ファイルが「未追跡」なのを見る<br>" +
          "・2つまとめてステージに追加 → 「first commit」で記録<br>" +
          "・履歴を1行表示で確認",
        allowed: ["git init", "git status", "git add .", 'git commit -m "..."', "git log --oneline"],
        model: `git init
git status
git add .
git commit -m "first commit"
git log --oneline`,
        checklist: [
          "init → add → commit の順番と、それぞれの役割を説明できる",
          "statusで「未追跡（赤）」→ addで「コミット予定（緑）」の変化を確認した",
          "logに自分のコミットが表示された",
        ],
      },
      {
        type: "write",
        previewMode: "term",
        termSetup: {
          inited: true,
          committed: ["index.html"],
          modified: ["index.html"],
          untracked: ["style.css"],
          commits: [{ hash: "a1b2c3d", msg: "first commit" }],
        },
        prompt:
          "開発中のリポジトリ（index.htmlは変更あり・style.cssは新規）を、GitHubに公開するところまで進めてください。<br>" +
          "・まず状態を確認 → 変更内容の差分も見る<br>" +
          "・全部ステージして「update site」で記録<br>" +
          "・リモート <code>https://github.com/kohaku/portfolio.git</code> を origin として登録<br>" +
          "・mainブランチをプッシュ",
        allowed: ["git status", "git diff", "git add .", 'git commit -m "..."', "git remote add origin URL", "git push -u origin main"],
        model: `git status
git diff
git add .
git commit -m "update site"
git remote add origin https://github.com/kohaku/portfolio.git
git push -u origin main`,
        checklist: [
          "diffで「何を変えたか」をコミット前に確認する習慣の意味を説明できる",
          "remote add origin は「送り先に origin というあだ名をつける」と説明できる",
          "pushで「* [new branch] main -> main」が表示された",
        ],
      },
      {
        type: "read",
        code: `$ git status
On branch main
Changes to be committed:（コミット予定）
        new file:   about.html
Changes not staged for commit:（変更あり・未ステージ）
        modified:   index.html
Untracked files:（未追跡の新ファイル）
        memo.txt`,
        question:
          "この状態で <code>git commit -m \"update\"</code> を実行すると、<strong>記録されるファイルはどれ</strong>でしょうか。" +
          "また、<strong>残りの2つも一緒に記録したい</strong>場合、commitの前に何と打てばよいですか。",
        answer:
          "記録されるのは <code>about.html</code> だけです。残りも記録するには、commitの前に <code>git add .</code>（または <code>git add index.html memo.txt</code>）を打ちます。",
        explanation:
          "コミットに入るのは「Changes to be committed（ステージ）」に載っているものだけ、が Git の大原則です。" +
          "<code>modified</code>（変更済み・未ステージ）も <code>Untracked</code>（未追跡）も、<strong>addしない限りコミットには入りません</strong>。" +
          "「commitしたのに変更が入っていない」というAI利用時のよくある混乱は、ほぼこのステージの見落としが原因です。",
        checklist: [
          "「ステージに載ったものだけがコミットされる」と説明できる",
          "modified と Untracked の違い（記録経験の有無）を説明できる",
        ],
      },
    ],
  },

  // ================= TypeScript 力試し =================
  {
    id: "review-ts",
    unit: "ts",
    title: "TypeScript 力試し",
    intro:
      "TypeScript編の総仕上げです。型注釈・interface・アロー関数・ユニオン型を組み合わせて書き、" +
      "最後は<strong>型エラーメッセージを読み解く</strong>問題——このユニットの最重要スキルです。JSのDOM操作も再登場します。",
    problems: [
      {
        type: "write",
        previewMode: "ts",
        scaffold: '<h1 style="font-size:20px">実行結果</h1><p id="output" style="font-size:16px"></p>',
        scaffoldNote: '前提: 画面には <code>&lt;p id="output"&gt;&lt;/p&gt;</code> が用意済み。TypeScriptだけを書きます。',
        prompt:
          "勉強仲間の紹介文ジェネレーターを書いてください。<br>" +
          "・<code>interface User</code>（name: string / age: number / goal: string）を定義<br>" +
          "・Userを受け取り「コハク（20歳）目標: TOEFL80」の形の文字列を返す関数 <code>introduce(user: User): string</code><br>" +
          "・User型の変数を2人分作り、<code>\" / \"</code> でつないでoutputに表示（<code>!</code> を忘れずに）",
        allowed: ["interface", "引数: 型 / 戻り値: string", "オブジェクト { }", "+（連結）", "document.getElementById()!", ".textContent"],
        model: `interface User {
  name: string;
  age: number;
  goal: string;
}

function introduce(user: User): string {
  return user.name + "（" + user.age + "歳）目標: " + user.goal;
}

const me: User = { name: "コハク", age: 20, goal: "TOEFL80" };
const friend: User = { name: "タロウ", age: 21, goal: "React習得" };

document.getElementById("output")!.textContent =
  introduce(me) + " / " + introduce(friend);`,
        checklist: [
          "interfaceで「データの形」を先に決めてから使った",
          "関数の引数と戻り値の両方に型を付けた",
          "2人分の紹介文が1行で表示された",
        ],
      },
      {
        type: "write",
        previewMode: "ts",
        scaffold: '<h1 style="font-size:20px">実行結果</h1><p id="output" style="font-size:16px"></p>',
        scaffoldNote: '前提: 画面には <code>&lt;p id="output"&gt;&lt;/p&gt;</code> が用意済み。TypeScriptだけを書きます。',
        prompt:
          "今月の出費チェッカーを書いてください。<br>" +
          "・<code>spending: number[] = [1200, 300, 4500, 800]</code> を宣言<br>" +
          "・<strong>アロー関数のfilter</strong>で1000円以上だけ残す<br>" +
          "・<code>type Category = \"food\" | \"study\"</code> と、Categoryを受け取り予算（food=20000、study=15000）を返す関数<br>" +
          "・「大きな出費: 1200, 4500 / studyの予算は15000円」の形でoutputに表示（<code>join</code>を使う）",
        allowed: ["number[]", ".filter()", "アロー関数 =>", ".join()", 'type A = "x" | "y"', "function", "document.getElementById()!"],
        model: `const spending: number[] = [1200, 300, 4500, 800];

const big: number[] = spending.filter((s: number) => s >= 1000);

type Category = "food" | "study";

function budget(category: Category): number {
  if (category === "food") {
    return 20000;
  }
  return 15000;
}

document.getElementById("output")!.textContent =
  "大きな出費: " + big.join(", ") + " / studyの予算は" + budget("study") + "円";`,
        checklist: [
          "filterの中をアロー関数で書けた（(s) => s >= 1000）",
          "ユニオン型で「2択しか許さない型」を作った",
          "joinで配列を1つの文字列にできた",
        ],
      },
      {
        type: "read",
        code: `function addPoint(score: number): number {
  return score + 10;
}

const result = addPoint("85");
document.getElementById("output")!.textContent = "結果: " + result;

// VSCodeでは5行目に赤線が出て、こう表示される:
// Argument of type 'string' is not assignable to
// parameter of type 'number'.`,
        question:
          "このエラーメッセージを<strong>日本語に訳し</strong>、どの行の何が原因か・どう直すかを書いてください。" +
          "さらに、もし型チェックなしでこのまま実行されたら <code>result</code> は何になるでしょう（ヒント: JSの + の挙動）。",
        answer:
          "訳:「string型の引数は、number型のパラメータに代入できません」。原因は <code>addPoint(\"85\")</code> と<strong>文字列を渡している</strong>こと。<code>addPoint(85)</code> と数値で渡せば直ります。型チェックなしで実行すると <code>\"85\" + 10</code> は<strong>文字列連結</strong>になり、resultは <code>\"8510\"</code> になります。",
        explanation:
          "JSでは「850ではなく8510が表示される」という<strong>静かなバグ</strong>になってしまうところを、TSは実行前のエラーで止めてくれます。" +
          "「Argument of type A is not assignable to parameter of type B」＝「A型の引数はB型の受け口に入れられません」は、AIのコードを直すときに最も頻繁に読む形式のエラー文です。",
        checklist: [
          "エラー文を自分の言葉で日本語に訳せた",
          "\"85\" + 10 が 8510 という文字列になる理由（+の二役）を説明できる",
        ],
      },
    ],
  },

  // ================= React 力試し =================
  {
    id: "review-react",
    unit: "react",
    title: "React 力試し",
    intro:
      "React編の総仕上げです。useState・イベント・三項演算子・map と key を、TSのinterfaceと一緒に使います。" +
      "最後は「ボタンを押しても画面が変わらない」——AIのReactコードで実際に起こる不具合の原因究明です。",
    problems: [
      {
        type: "write",
        previewMode: "react",
        prompt:
          "ポモドーロ記録アプリを作ってください。<br>" +
          "・<code>useState&lt;number&gt;(0)</code> でセット数を管理<br>" +
          "・「1セット完了」ボタンで1増える<br>" +
          "・<code>{sets}セット</code> と表示し、<strong>三項演算子</strong>で4セット以上なら「そろそろ休憩！」、未満なら「この調子！」を出す<br>" +
          "・importから書き始めること",
        allowed: ['import { useState } from "react"', "useState<number>(0)", "onClick={() => ...}", "{条件 ? A : B}", "JSX", "export default"],
        model: `import { useState } from "react";

function App() {
  const [sets, setSets] = useState<number>(0);

  return (
    <div>
      <h1>ポモドーロ記録</h1>
      <p>{sets}セット</p>
      <p>{sets >= 4 ? "そろそろ休憩！" : "この調子！"}</p>
      <button onClick={() => setSets(sets + 1)}>1セット完了</button>
    </div>
  );
}

export default App;`,
        checklist: [
          "値の変更をset関数だけで行った",
          "三項演算子を「JSXの中のif」として使えた",
          "4回押すとメッセージが切り替わるのを確認した",
        ],
      },
      {
        type: "write",
        previewMode: "react",
        prompt:
          "今週の提出物リストを作ってください。<br>" +
          "・<code>interface Assignment</code>（id: number / name: string / done: boolean）<br>" +
          "・Assignment[] の配列に3件入れる（済み1件・未提出2件など）<br>" +
          "・<strong>map</strong>で「✅ レポート」「⬜ 課題プリント」の形のliに変換（三項演算子で✅/⬜を出し分け、<code>key</code>を忘れずに）",
        allowed: ["interface", "型[] の配列", "{配列.map((a) => ( JSX ))}", "key={一意な値}", "{条件 ? \"✅\" : \"⬜\"}", "<ul> <li>", "export default"],
        model: `interface Assignment {
  id: number;
  name: string;
  done: boolean;
}

function App() {
  const assignments: Assignment[] = [
    { id: 1, name: "英語レポート", done: true },
    { id: 2, name: "情報の課題プリント", done: false },
    { id: 3, name: "AIサークルのスライド", done: false },
  ];

  return (
    <div>
      <h1>今週の提出物</h1>
      <ul>
        {assignments.map((a) => (
          <li key={a.id}>
            {a.done ? "✅" : "⬜"} {a.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
        checklist: [
          "interface → 配列 → map の3段構えで書けた",
          "liに key を付けた（なぜ必要かも説明できる）",
          "済み/未提出でマークが変わって表示された",
        ],
      },
      {
        type: "read",
        code: `import { useState } from "react";

function App() {
  const [count, setCount] = useState<number>(0);

  const addOne = () => {
    count = count + 1;
  };

  return (
    <div>
      <p>{count}回</p>
      <button onClick={addOne}>+1</button>
    </div>
  );
}

export default App;`,
        question:
          "このカウンター、<strong>ボタンを押しても画面が全く変わりません</strong>。" +
          "どこが・なぜダメなのかを説明し、正しく直した <code>addOne</code> を書いてください（Reactの鉄則第1条）。",
        answer:
          "<code>count = count + 1</code> と<strong>変数へ直接代入している</strong>のが原因です。正しくは <code>const addOne = () =&gt; { setCount(count + 1); };</code> ——<strong>stateの変更は必ずset関数で</strong>行います。",
        explanation:
          "Reactは「<strong>set関数が呼ばれたら再レンダリングする</strong>」仕組みなので、直接代入では変化に気づけず画面を描き直しません" +
          "（そもそも分割代入で受けたcountはconstなので代入自体もエラーになります）。" +
          "「ボタンは反応しているのに画面が変わらない」ときは、まずset関数を使っているかを疑う——AIのReactコードのデバッグ定番パターンです。",
        checklist: [
          "「set関数が呼ばれて初めて再レンダリングされる」と説明できる",
          "setCount(count + 1) を使う形に直せた",
        ],
      },
    ],
  },

  // ================= Next.js 力試し =================
  {
    id: "review-next",
    unit: "next",
    title: "Next.js 力試し",
    intro:
      "Next.js編の総仕上げです。layoutとLink・\"use client\"とuseStateを組み合わせ、" +
      "最後はAIのNext.jsコードで<strong>実際に最も多いエラー</strong>を読み解きます。HTMLの構造化タグ・Reactの知識も再登場します。",
    problems: [
      {
        type: "write",
        previewMode: "react",
        mount: "RootLayout",
        mountChildren: "（ここに各ページの中身が入ります）",
        scaffoldNote: "ファイル: app/layout.tsx のつもりで書きます。プレビューでは children の位置に仮の文章が差し込まれます。",
        prompt:
          "ポートフォリオサイト共通の「額縁」（layout.tsx）を作ってください。<br>" +
          "・importから書き始め、<code>RootLayout</code> を export default で定義（<code>children</code> を受け取る）<br>" +
          "・header: サイト名の見出し＋ <code>Link</code> を3つ（href=\"/\"、\"/works\"、\"/contact\"）<br>" +
          "・main: <code>{children}</code> を差し込む<br>" +
          "・footer: 「© 2026 Kohaku」",
        allowed: ['import Link from "next/link"', "{ children }: { children: React.ReactNode }", "<Link href=...>", "<header> <main> <footer>", "{children}", "export default"],
        model: `import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <h1>Kohaku Portfolio</h1>
        <Link href="/">ホーム</Link> | <Link href="/works">作品</Link> | <Link href="/contact">連絡先</Link>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2026 Kohaku</p>
      </footer>
    </div>
  );
}`,
        checklist: [
          "childrenが「各ページの差し込み口」だと説明できる",
          "Linkとaタグの違い（差し替え vs 全体再読込）を説明できる",
          "HTML-05の header / main / footer をlayout設計に再利用できた",
        ],
      },
      {
        type: "write",
        previewMode: "react",
        mount: "DiaryPage",
        scaffoldNote: "ファイル: app/diary/page.tsx のつもりで書きます。",
        prompt:
          "「/diary」に、ひとこと日記ページを作ってください。<br>" +
          "・useStateとonChangeを使うので、<strong>必要な宣言をファイルの先頭に</strong>忘れずに<br>" +
          "・<code>DiaryPage</code> を export default で定義<br>" +
          "・入力欄（value / onChange）と、「{文字数}文字: {入力内容}」と表示する段落",
        allowed: ['"use client"', 'import { useState } from "react"', 'useState<string>("")', "value= / onChange=", "e.target.value", ".length", "export default"],
        model: `"use client";

import { useState } from "react";

export default function DiaryPage() {
  const [text, setText] = useState<string>("");

  return (
    <main>
      <h1>ひとこと日記</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>{text.length}文字: {text}</p>
    </main>
  );
}`,
        checklist: [
          '"use client" を1行目に書いた（なぜ必要かも説明できる）',
          "入力するたびに文字数と内容がリアルタイムで変わるのを確認した",
          "サーバー/クライアントの使い分け基準を説明できる",
        ],
      },
      {
        type: "read",
        code: `import { useState } from "react";

export default function LikePage() {
  const [likes, setLikes] = useState<number>(0);

  return (
    <main>
      <p>{likes} いいね</p>
      <button onClick={() => setLikes(likes + 1)}>❤️</button>
    </main>
  );
}

// 実行するとこのエラーで止まる:
// Error: useState only works in Client Components.
// Add the "use client" directive at the top of the file.`,
        question:
          "AIが生成したNext.jsのページがこのエラーで動きません。<strong>エラー文を日本語に訳し</strong>、" +
          "なぜ起きたのか・どう直すのかを書いてください（直しは1行です）。",
        answer:
          "訳:「useStateはClient Component専用です。ファイルの先頭に \"use client\" 宣言を足してください」。" +
          "Next.jsのコンポーネントは<strong>標準ではサーバーで動く</strong>ため、ブラウザでしか動かせないuseStateが使えません。" +
          "1行目に <code>\"use client\";</code> を足せば直ります。",
        explanation:
          "「表示するだけならサーバーのまま、触って反応するなら \"use client\"」が使い分けの基準です。" +
          "このエラーはAIが生成するNext.jsコードの<strong>不動の頻出1位</strong>——エラー文がそのまま直し方を教えてくれる良い例なので、読めれば怖くありません。",
        checklist: [
          "エラー文を日本語に訳せた",
          "サーバーコンポーネントでuseStateが使えない理由を説明できる",
        ],
      },
    ],
  },

  // ================= React Native 力試し =================
  {
    id: "review-rn",
    unit: "rn",
    title: "React Native 力試し",
    intro:
      "React Native編の総仕上げです。View / Text / StyleSheet・onPress・TextInput / FlatList——" +
      "CSSのFlexboxやReactのuseStateが<strong>スマホの文法でそのまま生きる</strong>ことを確認します。最後はWebの癖が残ったコードの間違い探しです。",
    problems: [
      {
        type: "write",
        previewMode: "rn",
        prompt:
          "水分補給トラッカーを作ってください。<br>" +
          "・<code>useState&lt;number&gt;(0)</code> で杯数を管理し、大きな文字で「{count}杯」<br>" +
          "・<strong>TouchableOpacity</strong>の自作ボタン（背景色・padding・角丸）で「+1杯」<br>" +
          "・三項演算子で8杯以上なら「目標達成！」、未満なら「目標は8杯」<br>" +
          "・全体を画面中央寄せ（alignItems / justifyContent）",
        allowed: ['import { useState } from "react"', 'import { View, Text, TouchableOpacity, StyleSheet } from "react-native"', "onPress={() => ...}", "{条件 ? A : B}", "StyleSheet.create", "alignItems / justifyContent"],
        model: `import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count}杯</Text>
      <Text>{count >= 8 ? "目標達成！" : "目標は8杯"}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>+1杯</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  number: { fontSize: 44, fontWeight: "bold" },
  button: { backgroundColor: "#0ea5e9", padding: 14, borderRadius: 999, marginTop: 12 },
  buttonText: { color: "white", fontSize: 16 },
});`,
        checklist: [
          "onClickではなくonPressを使った",
          "スタイルをStyleSheet.createにまとめ、CSSのFlexbox知識（中央寄せ）を再利用した",
          "8杯でメッセージが変わるのを確認した",
        ],
      },
      {
        type: "write",
        previewMode: "rn",
        prompt:
          "覚えたい英単語リストのアプリを作ってください（卒業制作の復習）。<br>" +
          "・入力欄（<strong>TextInput</strong>: value / onChangeText / placeholder）＋「追加」ボタン（<strong>Button</strong>）。空文字は追加しない<br>" +
          "・「{件数}語登録済み」とTextで表示<br>" +
          "・一覧は<strong>FlatList</strong>（data / keyExtractor / renderItem）で表示",
        allowed: ["useState<string> / useState<string[]>", "TextInput（value / onChangeText / placeholder）", "Button（title / onPress）", "FlatList（data / keyExtractor / renderItem）", "[...配列, 追加分]", "if (...) return;", ".length"],
        model: `import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

export default function App() {
  const [word, setWord] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);

  const addWord = () => {
    if (word === "") return;
    setWords([...words, word]);
    setWord("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>英単語帳</Text>
      <TextInput
        style={styles.input}
        value={word}
        onChangeText={setWord}
        placeholder="単語を入力"
      />
      <Button title="追加" onPress={addWord} />
      <Text>{words.length}語登録済み</Text>
      <FlatList
        data={words}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <Text style={styles.word}>📖 {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#94a3b8", borderRadius: 6, padding: 8, marginVertical: 8 },
  word: { fontSize: 16, paddingVertical: 4 },
});`,
        checklist: [
          "onChangeTextにset関数を直接渡せた（e.target.valueが不要な理由も説明できる）",
          "スプレッド構文 [...words, word] で「新しい配列」を作って追加した",
          "FlatListの data / keyExtractor / renderItem をmapと対応づけて説明できる",
        ],
      },
      {
        type: "read",
        code: `import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text>{count}回</Text>
      <TouchableOpacity style={styles.button} onClick={() => setCount(count + 1)}>
        <Text>タップ</Text>
      </TouchableOpacity>
      <p>がんばろう</p>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  button: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8 },
});`,
        question:
          "Web版Reactに慣れた人が書いたこのRNコードには、<strong>「Webの癖」が2か所</strong>残っていて正しく動きません。" +
          "2か所を特定し、それぞれどう直すか書いてください。",
        answer:
          "① <code>onClick</code> → RNでは <code>onPress</code>（スマホにクリックはない）。" +
          "② <code>&lt;p&gt;がんばろう&lt;/p&gt;</code> → RNにHTMLタグは存在しないので <code>&lt;Text&gt;がんばろう&lt;/Text&gt;</code> にする。",
        explanation:
          "RNの画面はHTMLではなくスマホのネイティブ部品でできているため、<strong>タグは必ずRNの部品（View / Text など）</strong>を使い、" +
          "文字は必ずTextで包みます。イベント名の対応（onClick→onPress、onChange→onChangeText）とあわせて、" +
          "Web→RN移植でAIもよくやらかす2大ミスです。",
        checklist: [
          "onPressとonClickの違い（プラットフォームの違い）を説明できる",
          "「RNでは文字は必ずTextで包む」と説明できる",
        ],
      },
    ],
  },

  // ================= Python 力試し =================
  {
    id: "review-py",
    unit: "py",
    title: "Python 力試し",
    intro:
      "Python編の総仕上げです。リスト・for・内包表記・辞書・def・importを組み合わせます。" +
      "<strong>JS/TSとの対応</strong>（filter⇔内包表記、型注釈⇔型ヒント）を意識しながら書くと、3言語分の復習になります。" +
      "※ ▶実行の初回はPython読み込みに10秒ほどかかります。",
    problems: [
      {
        type: "write",
        previewMode: "py",
        scaffoldNote: "▶実行の初回はPython環境の読み込みに10秒ほどかかります。2回目からは速くなります。",
        prompt:
          "今週覚えた英単語数を集計してください。<br>" +
          "・<code>words = [30, 45, 20, 60, 50]</code> を定義<br>" +
          "・forで1日ずつ「◯語」と出力<br>" +
          "・<strong>リスト内包表記</strong>（JSのfilterにあたる）で40語以上の日だけのリストを作り「がんばった日: [...]」と出力<br>" +
          "・<code>statistics</code> をimportして「平均: ◯語」と出力",
        allowed: ["リスト [ ]", "for x in リスト:", "[x for x in xs if 条件]", "import statistics", "statistics.mean()", 'print(f"...")'],
        model: `import statistics

words = [30, 45, 20, 60, 50]

for w in words:
    print(f"{w}語")

good_days = [w for w in words if w >= 40]
print(f"がんばった日: {good_days}")

print(f"平均: {statistics.mean(words)}語")`,
        checklist: [
          "forと内包表記のブロック・インデントを正しく書けた",
          "内包表記を「後ろから」読んで、JSのfilterと対応づけて説明できる",
          "importして「モジュール名.関数名」で呼び出せた",
        ],
      },
      {
        type: "write",
        previewMode: "py",
        scaffoldNote: "▶実行の初回はPython環境の読み込みに10秒ほどかかります。",
        prompt:
          "科目紹介の関数を書いてください。<br>" +
          "・<code>def describe(subject: dict) -&gt; str:</code> を型ヒント付きで定義<br>" +
          "・辞書に <code>\"memo\"</code> キーが<strong>あれば</strong>「AI: 週6時間（メモ: 楽しい）」、なければ「英語: 週5時間」の形の文字列を返す<br>" +
          "・辞書を2つ（memoあり・なし）作って、両方printする<br>" +
          "・f文字列の中の辞書アクセスはクォートの種類に注意（外が \" なら中は '）",
        allowed: ["def 名前(引数: 型) -> 型:", '辞書 {"key": 値}', '"key" in 辞書', "if / return", "f\"{d['key']}\"", "print()"],
        model: `def describe(subject: dict) -> str:
    if "memo" in subject:
        return f"{subject['name']}: 週{subject['hours']}時間（メモ: {subject['memo']}）"
    return f"{subject['name']}: 週{subject['hours']}時間"

ai = {"name": "AI", "hours": 6, "memo": "楽しい"}
english = {"name": "英語", "hours": 5}

print(describe(ai))
print(describe(english))`,
        checklist: [
          "型ヒント（: dict, -> str）をTSの型注釈と対応づけて説明できる",
          '"memo" in で「キーの有無」によって返す文字列を変えられた',
          "f文字列の外側と内側でクォートを使い分けた",
        ],
      },
      {
        type: "read",
        code: `prices = [120, 380, 90, 500]

cheap = [p for p in prices if p < 200]
print(cheap)

print(f"合計: {sum(prices)}円")
print(f"平均: {sum(prices) / len(prices)}円")`,
        question:
          "このコードの<strong>出力3行を正確に予想</strong>してください（数値・記号まで）。" +
          "ヒント: Pythonの <code>/</code> の結果はどんな数になる？",
        answer:
          "<code>[120, 90]</code>／<code>合計: 1090円</code>／<code>平均: 272.5円</code> の3行です。",
        explanation:
          "内包表記は「pricesの各pについて、200未満なら集める」なので [120, 90]（<strong>元の順番のまま</strong>）。" +
          "合計は 120+380+90+500=1090。平均は 1090 / 4 = 272.5——Pythonの <code>/</code> は<strong>常に小数を返す</strong>ので、" +
          "割り切れても 272.5 のような小数表記になります（整数のまま割るなら <code>//</code>）。" +
          "リストのprintは角カッコ・カンマ付きでそのまま表示されるのもポイントです。",
        checklist: [
          "内包表記を読んで結果のリストを言い当てられた",
          "/ が常に小数を返すこと（//との違い）を説明できる",
        ],
      },
    ],
  },

  // ================= SQL 力試し =================
  {
    id: "review-sql",
    unit: "sql",
    title: "SQL 力試し",
    intro:
      "SQL編の総仕上げです。SELECT / WHERE / ORDER BY / GROUP BY / JOIN を、実際のテーブルに対して書きます。" +
      "最後はJOINの結果を<strong>実行せずに予想する</strong>問題——AIが書いたSQLのチェックそのものです。",
    problems: [
      {
        type: "write",
        previewMode: "sql",
        seedSql: "CREATE TABLE study_log (id INTEGER, subject TEXT, hours REAL, day TEXT); INSERT INTO study_log VALUES (1,'AI',2,'月'),(2,'プログラミング',1,'火'),(3,'AI',2,'水'),(4,'プログラミング',4,'木'),(5,'英語',3,'金'),(6,'AI',3,'土'),(7,'英語',2,'日');",
        scaffoldNote: "テーブル: study_log（id, subject, hours, day）— 1週間の学習記録7件が入っています。",
        prompt:
          "学習記録テーブル <code>study_log</code>（id / subject / hours / day）に質問してください。<br>" +
          "・<strong>2時間以上</strong>勉強した記録だけを<br>" +
          "・<strong>hoursの多い順</strong>に並べて<br>" +
          "・<code>subject</code>・<code>hours</code>・<code>day</code> の3列だけ表示",
        allowed: ["SELECT 列, 列", "FROM", "WHERE", ">=", "ORDER BY 列 DESC"],
        model: `SELECT subject, hours, day
FROM study_log
WHERE hours >= 2
ORDER BY hours DESC;`,
        checklist: [
          "SELECTで「列の絞り込み」、WHEREで「行の絞り込み」と説明できる",
          "ORDER BY ... DESC で降順に並んだ（1時間の行が消えている）",
          "結果テーブルが6行になった",
        ],
      },
      {
        type: "write",
        previewMode: "sql",
        seedSql: "CREATE TABLE study_log (id INTEGER, subject TEXT, hours REAL, day TEXT); INSERT INTO study_log VALUES (1,'AI',2,'月'),(2,'プログラミング',1,'火'),(3,'AI',2,'水'),(4,'プログラミング',4,'木'),(5,'英語',3,'金'),(6,'AI',3,'土'),(7,'英語',2,'日');",
        scaffoldNote: "テーブル: study_log（id, subject, hours, day）— 1週間の学習記録7件が入っています。",
        prompt:
          "「今週、<strong>どの科目に何時間使ったか</strong>」を集計してください。<br>" +
          "・科目ごとにグループ化して合計時間を出す（<code>GROUP BY</code> と <code>SUM</code>）<br>" +
          "・<strong>合計時間の多い順</strong>に並べる<br>" +
          "・列は subject と 合計時間 の2列",
        allowed: ["SELECT", "SUM(列)", "FROM", "GROUP BY", "ORDER BY ... DESC"],
        model: `SELECT subject, SUM(hours)
FROM study_log
GROUP BY subject
ORDER BY SUM(hours) DESC;`,
        checklist: [
          "GROUP BYで「科目ごとの束」にしてからSUMした、と説明できる",
          "AI=7・英語=5・プログラミング=5 の集計になった",
          "WHERE（行の絞り込み）とGROUP BY（束ねて集計）の違いを説明できる",
        ],
      },
      {
        type: "read",
        code: `-- users テーブル          -- posts テーブル
-- id | name               -- id | user_id | content
-- 1  | コハク             -- 1  | 1       | HTML完了！
-- 2  | タロウ             -- 2  | 1       | SQLたのしい
                            -- 3  | 2       | React学習中

SELECT users.name, posts.content
FROM posts
JOIN users ON posts.user_id = users.id
WHERE users.name = 'コハク';`,
        question:
          "このJOINクエリの<strong>結果テーブルを実行せずに予想</strong>してください。" +
          "何行になり、各行にはどんな値が並びますか。",
        answer:
          "結果は<strong>2行</strong>です。<br>「コハク | HTML完了！」<br>「コハク | SQLたのしい」<br>タロウの投稿（React学習中）はWHEREで除外されます。",
        explanation:
          "<code>JOIN ... ON posts.user_id = users.id</code> で「投稿のuser_idとユーザーのidが一致する行」をつなぎ、" +
          "3件の投稿すべてに名前が付きます。その後 <code>WHERE users.name = 'コハク'</code> で絞るので、user_id=1 の2件だけが残ります。" +
          "「ONはつなぐ条件、WHEREは絞る条件」——この区別ができれば、AIが書いたJOINも読み解けます。",
        checklist: [
          "ON（つなぐ条件）とWHERE（絞る条件）の役割の違いを説明できる",
          "結果の行数と中身を実行前に言い当てられた",
        ],
      },
    ],
  },

  // ================= Ruby / Rails 力試し =================
  {
    id: "review-ruby",
    unit: "ruby",
    title: "Ruby / Rails 力試し",
    intro:
      "Ruby / Rails編の総仕上げです。Rubyのブロック・クラス、ActiveRecordとSQLの往復、" +
      "そして<strong>Railsコードの読解</strong>——つなげーとの実務で毎日やることの予行演習です。",
    problems: [
      {
        type: "write",
        previewMode: "rb",
        scaffoldNote: "▶実行の初回はRuby環境の読み込みに5〜10秒かかります。",
        prompt:
          "今週の読書記録を集計してください。<br>" +
          "・<code>pages = [12, 30, 8, 25]</code> を定義<br>" +
          "・each（do 〜 end）で1日ずつ「◯ページ」と出力<br>" +
          "・<strong>select</strong>で20ページ以上の日だけ残し「よく読めた日: [30, 25]」と出力（inspect）<br>" +
          "・sumで「合計: ◯ページ」と出力（式展開を使う）",
        allowed: ["配列 [ ]", "each do |x| 〜 end", "select { |x| 条件 }", ".sum", ".inspect", 'puts "#{ }"'],
        model: `pages = [12, 30, 8, 25]

pages.each do |p|
  puts "#{p}ページ"
end

good_days = pages.select { |p| p >= 20 }
puts "よく読めた日: #{good_days.inspect}"

puts "合計: #{pages.sum}ページ"`,
        checklist: [
          "do 〜 end と { } の2つのブロック記法を使い分けた",
          "selectをJSのfilter・Pythonの内包表記と対応づけて説明できる",
          "式展開 #{ } で変数と計算結果を文字列に埋め込めた",
        ],
      },
      {
        type: "write",
        previewMode: "ar",
        seedSql: "CREATE TABLE posts (id INTEGER, content TEXT, likes INTEGER); INSERT INTO posts VALUES (1,'HTML完了！',12),(2,'Ruby学習中',8),(3,'Rails予習なう',25),(4,'SQL楽しい',3);",
        scaffoldNote: "テーブル: posts（id, content, likes）・4件入り。ActiveRecord式を1行ずつ書いて実行。",
        prompt:
          "rails console のつもりで、ActiveRecordで次の3つを取得してください。<br>" +
          "① いいねが10未満の投稿（<code>where</code>）<br>" +
          "② 全投稿を「いいねの少ない順」で（<code>order(:likes)</code> は昇順）<br>" +
          "③ 投稿の総数<br>" +
          "実行して、<strong>翻訳されたSQLがSQLユニットで書いた形になっているか</strong>を確認すること",
        allowed: ['Post.where("条件")', "Post.order(:列)", "Post.count"],
        model: `Post.where("likes < 10")
Post.order(:likes)
Post.count`,
        checklist: [
          "3行それぞれの翻訳SQL（WHERE / ORDER BY / COUNT）を確認した",
          "Post（単数）→ posts（複数）の命名規約を説明できる",
          "「ActiveRecordはSQLの翻訳者」を自分の言葉で説明できる",
        ],
      },
      {
        type: "read",
        code: `# config/routes.rb
Rails.application.routes.draw do
  get "/posts/:id", to: "posts#show"
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])
  end
end

# app/views/posts/show.html.erb
<h1><%= @post.content %></h1>
<p>いいね: <%= @post.likes %></p>

# postsテーブル: (1,'HTML完了！',12) (2,'Ruby学習中',8) (3,'Rails予習なう',25)`,
        question:
          "ブラウザで <code>/posts/3</code> にアクセスしました。<strong>何がどの順で起こり、最終的に画面に何が表示されるか</strong>を、" +
          "3ファイルを順に追って説明してください。<code>Post.find(params[:id])</code> が翻訳される<strong>SQL</strong>も書くこと。",
        answer:
          "① routes.rb が「/posts/:id」に一致し、<strong>:id = 3</strong> として PostsController#show へ振り分ける<br>" +
          "② controller の show が実行され、<code>params[:id]</code>（=3）で <code>Post.find(3)</code> → SQLは <code>SELECT * FROM posts WHERE id = 3 LIMIT 1;</code>。結果が @post に入る<br>" +
          "③ show.html.erb が @post を使ってレンダリングされ、画面には見出し「<strong>Rails予習なう</strong>」と「いいね: 25」が表示される",
        explanation:
          "「:id」はURLの一部を<strong>params というハッシュ</strong>で受け取る仕組みです（ruby-03のハッシュ＋シンボルがここで登場: params[:id]）。" +
          "routes → controller → model（SQL）→ view という一生の流れは、どんなに複雑なRailsアプリでも同じです。" +
          "実務でAIのコードを追うときも、この順でファイルをたどれば必ず原因の層にたどり着けます。",
        checklist: [
          "リクエストの一生（routes→controller→model→view）を順に説明できた",
          "params[:id] が「URLの一部をハッシュで受け取る仕組み」だと説明できる",
          "Post.find(3) のSQL翻訳（WHERE id = 3 LIMIT 1）を書けた",
        ],
      },
    ],
  },
];
