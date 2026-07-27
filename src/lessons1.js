// 教材データ(1/3): ユニット定義 + HTML / CSS / JavaScript
// カリキュラムの順序: HTML → CSS → JS → TS → React → Next.js → React Native

const UNITS = [
  { id: "html", name: "HTML", desc: "ページの骨組み" },
  { id: "css", name: "CSS", desc: "見た目・デザイン" },
  { id: "js", name: "JavaScript", desc: "動きをつける" },
  { id: "git", name: "Git", desc: "作品を保存・公開する" },
  { id: "ts", name: "TypeScript", desc: "JSに型という安全装置を" },
  { id: "react", name: "React", desc: "部品でUIを組む" },
  { id: "next", name: "Next.js", desc: "実務標準のWebフレームワーク" },
  { id: "rn", name: "React Native", desc: "スマホアプリ開発" },
  { id: "py", name: "Python", desc: "AI・データ分析の王者" },
  { id: "sql", name: "SQL", desc: "データベースを操る" },
  { id: "ruby", name: "Ruby / Rails", desc: "実務予習: Railsを読めるように" },
];

const LESSONS = [
  // ================= HTML =================
  {
    id: "html-01",
    unit: "html",
    title: "HTMLとは・最初のページ",
    explanation: `
<h3>HTMLは「ページの骨組み」を作る言語</h3>
<p>Webページは3つの言語の役割分担でできています。<strong>HTML</strong>が文章の構造（骨組み）、<strong>CSS</strong>が見た目（服装）、<strong>JavaScript</strong>が動き（筋肉）です。まずは骨組みのHTMLから始めます。</p>
<p>HTMLは「タグ」と呼ばれる目印で文章を囲んで、「ここは見出し」「ここは段落」と意味づけをします。タグは <code>&lt;h1&gt;</code> のように山カッコで書き、<code>&lt;h1&gt;こんにちは&lt;/h1&gt;</code> のように<strong>開始タグと終了タグ（/付き）で挟む</strong>のが基本です。</p>

<h3>すべてのページに共通する「決まり文句」</h3>
<pre><code>&lt;!DOCTYPE html&gt;        ← 「これはHTML5の文書です」という宣言
&lt;html lang="ja"&gt;        ← ページ全体を包む。lang="ja"は「日本語のページ」の意味
&lt;head&gt; ... &lt;/head&gt;      ← ページの設定情報を書く場所（画面には表示されない）
&lt;body&gt; ... &lt;/body&gt;      ← 画面に表示される中身を書く場所</code></pre>
<p><code>&lt;head&gt;</code> の中の <code>&lt;meta charset="UTF-8"&gt;</code> は文字化けを防ぐおまじない、<code>&lt;title&gt;</code> はブラウザのタブに表示される名前です。</p>

<h3>今回使うタグ</h3>
<ul>
  <li><code>&lt;h1&gt;</code> — いちばん大きな見出し（heading 1）。1ページに1つが原則</li>
  <li><code>&lt;p&gt;</code> — 段落（paragraph）。普通の文章はこれで囲む</li>
</ul>
<div class="tip">💡 <strong>なぜタグで囲むのか？</strong> 見た目のためではなく「意味」を伝えるためです。検索エンジンや音声読み上げソフトは、タグを見て「ここが重要な見出しだ」と判断します。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのページ</title>
</head>
<body>
  <h1>こんにちは、HTML！</h1>
  <p>これが私の最初のページです。</p>
  <p>タグの意味を考えながら書いています。</p>
</body>
</html>`,
    challenge: {
      spec: "自己紹介ページを作ってください。<br>・ブラウザのタブに「自己紹介」と表示される<br>・いちばん大きな見出しで自分の名前（ニックネーム可）<br>・段落を2つ（例: 所属と、最近ハマっていること）",
      allowed: ["<!DOCTYPE html>", "<html>", "<head>", "<meta>", "<title>", "<body>", "<h1>", "<p>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>自己紹介</title>
</head>
<body>
  <h1>コハク</h1>
  <p>北大でAIを勉強している学生です。</p>
  <p>最近はプログラミング学習にハマっています。</p>
</body>
</html>`,
      checklist: [
        "<!DOCTYPE html> から書き始めた",
        "<head>の中に<meta charset>と<title>がある",
        "<h1>と<p>が<body>の中にある",
        "すべてのタグを閉じ忘れていない",
      ],
    },
  },
  {
    id: "html-02",
    unit: "html",
    title: "見出しのレベルとリスト",
    explanation: `
<h3>見出しには6段階のレベルがある</h3>
<p>見出しタグは <code>&lt;h1&gt;</code> から <code>&lt;h6&gt;</code> まであります。数字が大きいほど下位の（小さい）見出しです。本の「章→節→項」と同じで、<strong>大きさではなく階層構造</strong>を表します。h1の次はh2、その中はh3…と順番に使い、飛ばさないのがルールです。</p>

<h3>リストは2種類</h3>
<ul>
  <li><code>&lt;ul&gt;</code> — 順序のないリスト（unordered list）。黒丸で表示される</li>
  <li><code>&lt;ol&gt;</code> — 順序のあるリスト（ordered list）。1. 2. 3. と番号がつく</li>
</ul>
<p>どちらも、中の1項目1項目は <code>&lt;li&gt;</code>（list item）で囲みます。</p>
<pre><code>&lt;ul&gt;
  &lt;li&gt;りんご&lt;/li&gt;
  &lt;li&gt;みかん&lt;/li&gt;
&lt;/ul&gt;</code></pre>

<h3>入れ子（ネスト）とインデント</h3>
<p>タグの中にタグを入れることを「入れ子」や「ネスト」と呼びます。ネストしたら<strong>半角スペース2つ分の字下げ（インデント）</strong>をするのが読みやすいコードの基本です。コンピュータはインデントがなくても動きますが、<strong>人間（未来の自分）が読めるコード</strong>を書く習慣は今からつけましょう。</p>
<div class="tip">💡 「手順」や「ランキング」のように順番に意味があるなら <code>&lt;ol&gt;</code>、「好きなもの一覧」のように順番がどうでもいいなら <code>&lt;ul&gt;</code> と使い分けます。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>好きなものリスト</title>
</head>
<body>
  <h1>私の好きなもの</h1>
  <h2>食べ物</h2>
  <ul>
    <li>ラーメン</li>
    <li>寿司</li>
  </ul>
  <h2>朝のルーティン</h2>
  <ol>
    <li>起きる</li>
    <li>タイピング練習をする</li>
    <li>AIニュースを読む</li>
  </ol>
</body>
</html>`,
    challenge: {
      spec: "「今週の計画」ページを作ってください。<br>・h1で「今週の計画」<br>・h2で「勉強すること」、その下に順序なしリストで項目を2つ以上<br>・h2で「やる順番」、その下に順序ありリストで手順を3つ",
      allowed: ["<!DOCTYPE html>", "<html>", "<head>", "<meta>", "<title>", "<body>", "<h1>", "<h2>", "<ul>", "<ol>", "<li>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>今週の計画</title>
</head>
<body>
  <h1>今週の計画</h1>
  <h2>勉強すること</h2>
  <ul>
    <li>HTMLの基礎</li>
    <li>TOEFLの単語</li>
  </ul>
  <h2>やる順番</h2>
  <ol>
    <li>タイピング練習</li>
    <li>プログラミング学習</li>
    <li>英語のシャドーイング</li>
  </ol>
</body>
</html>`,
      checklist: [
        "h1→h2の順で見出しを使った（レベルを飛ばしていない）",
        "順序の有無でulとolを使い分けた",
        "liがul/olの中に正しくネストされ、インデントされている",
      ],
    },
  },
  {
    id: "html-03",
    unit: "html",
    title: "リンクと画像",
    explanation: `
<h3>属性 — タグに追加情報を持たせる</h3>
<p>今回の主役は「属性」です。開始タグの中に <code>名前="値"</code> の形で書き、タグに追加情報を持たせます。<code>&lt;html lang="ja"&gt;</code> の <code>lang="ja"</code> も属性でした。</p>

<h3>リンク: &lt;a&gt; タグ</h3>
<pre><code>&lt;a href="https://www.google.com"&gt;Googleへ&lt;/a&gt;</code></pre>
<ul>
  <li><code>href</code> 属性 — 飛び先のURL（hyperlink referenceの略）</li>
  <li>タグで挟んだテキストが、クリックできる青い文字になる</li>
</ul>

<h3>画像: &lt;img&gt; タグ</h3>
<pre><code>&lt;img src="https://placehold.co/200x100" alt="サンプル画像"&gt;</code></pre>
<ul>
  <li><code>src</code> 属性 — 画像ファイルの場所（source）</li>
  <li><code>alt</code> 属性 — 画像が表示できないときに代わりに出る説明文。目の不自由な人向けの読み上げにも使われる。<strong>必ず書く</strong></li>
  <li><code>&lt;img&gt;</code> は中に何も挟まないので、<strong>終了タグがない</strong>珍しいタグ</li>
</ul>
<div class="tip">💡 練習で使っている placehold.co は「指定したサイズのダミー画像」を返してくれるサービスです。ネットに繋がっていないと画像は出ませんが、そのときこそaltの出番です。altの文字が表示されるはずです。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>リンクと画像</title>
</head>
<body>
  <h1>お気に入り集</h1>
  <p>よく使うサイト:</p>
  <ul>
    <li><a href="https://www.google.com">Google</a></li>
    <li><a href="https://claude.ai">Claude</a></li>
  </ul>
  <img src="https://placehold.co/300x150" alt="ダミー画像">
</body>
</html>`,
    challenge: {
      spec: "「リンク集」ページを作ってください。<br>・h1で「リンク集」<br>・順序なしリストの中に、リンクを2つ（飛び先は実在するサイトなら何でもOK）<br>・その下に画像を1枚（src は https://placehold.co/200x100 でOK、altを必ず付ける）",
      allowed: ["<!DOCTYPE html>", "<html>", "<head>", "<meta>", "<title>", "<body>", "<h1>", "<ul>", "<li>", "<a href>", "<img src alt>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>リンク集</title>
</head>
<body>
  <h1>リンク集</h1>
  <ul>
    <li><a href="https://www.google.com">Google</a></li>
    <li><a href="https://github.com">GitHub</a></li>
  </ul>
  <img src="https://placehold.co/200x100" alt="ダミーのバナー画像">
</body>
</html>`,
      checklist: [
        "aタグにhref属性を書き、テキストを挟んだ",
        "imgタグにsrcとaltの両方を書いた",
        "imgに終了タグを書いていない（不要なため）",
      ],
    },
  },
  {
    id: "html-04",
    unit: "html",
    title: "フォーム入門（入力欄とボタン）",
    explanation: `
<h3>ユーザーから入力を受け取る部品</h3>
<p>検索窓、ログイン画面、お問い合わせ…Webの「入力」はすべてフォーム部品でできています。今回は代表的な3つを覚えます。</p>
<ul>
  <li><code>&lt;input&gt;</code> — 1行の入力欄。<code>type</code> 属性で種類が変わる（<code>text</code>=文字、<code>password</code>=伏せ字、<code>number</code>=数値）。終了タグなし</li>
  <li><code>&lt;label&gt;</code> — 入力欄の「名札」。<code>for</code> 属性に入力欄の <code>id</code> を書くと紐づき、名札をクリックしただけで入力欄にカーソルが入る</li>
  <li><code>&lt;button&gt;</code> — ボタン。挟んだテキストがボタンの表示になる</li>
</ul>

<h3>id属性 — 部品につける固有の名前</h3>
<pre><code>&lt;label for="name"&gt;名前&lt;/label&gt;
&lt;input type="text" id="name" placeholder="山田太郎"&gt;</code></pre>
<p><code>id</code> は「ページ内でその部品だけを指す固有の名前」です。同じidを2回使ってはいけません。<code>placeholder</code> は入力欄が空のときに薄く表示されるヒント文字です。</p>
<div class="tip">💡 今回のボタンは押しても何も起きません。「押したら何かが起きる」を作るのはJavaScriptの仕事です。JS-03で、このボタンに命を吹き込みます。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>会員登録</title>
</head>
<body>
  <h1>会員登録</h1>
  <p>
    <label for="username">ユーザー名</label>
    <input type="text" id="username" placeholder="kohaku">
  </p>
  <p>
    <label for="password">パスワード</label>
    <input type="password" id="password">
  </p>
  <button>登録する</button>
</body>
</html>`,
    challenge: {
      spec: "「アンケート」ページを作ってください。<br>・h1で「アンケート」<br>・「ニックネーム」というラベル付きの文字入力欄（placeholderも付ける）<br>・「年齢」というラベル付きの数値入力欄（type=\"number\"）<br>・「送信」ボタン",
      allowed: ["<!DOCTYPE html>", "<html>", "<head>", "<meta>", "<title>", "<body>", "<h1>", "<p>", "<label for>", "<input type id placeholder>", "<button>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>アンケート</title>
</head>
<body>
  <h1>アンケート</h1>
  <p>
    <label for="nickname">ニックネーム</label>
    <input type="text" id="nickname" placeholder="コハク">
  </p>
  <p>
    <label for="age">年齢</label>
    <input type="number" id="age">
  </p>
  <button>送信</button>
</body>
</html>`,
      checklist: [
        "labelのfor属性とinputのid属性が対応している",
        "typeをtext / numberで使い分けた",
        "ラベルの文字をクリックすると入力欄にカーソルが入る（プレビューで確認）",
      ],
    },
  },
  {
    id: "html-05",
    unit: "html",
    title: "ページの構造化（header / main / footer / div / span）",
    explanation: `
<h3>ページを「意味のある区画」に分ける</h3>
<p>実際のWebサイトは、上部にロゴとメニュー、中央に本文、下部にコピーライト…という区画に分かれています。HTMLにはその区画を表す専用タグがあります。</p>
<ul>
  <li><code>&lt;header&gt;</code> — ページ上部。サイト名やナビゲーション</li>
  <li><code>&lt;nav&gt;</code> — ナビゲーション（メニューのリンク集）</li>
  <li><code>&lt;main&gt;</code> — そのページの主要コンテンツ。1ページに1つ</li>
  <li><code>&lt;footer&gt;</code> — ページ下部。コピーライトや連絡先</li>
</ul>

<h3>万能の箱: div と span</h3>
<ul>
  <li><code>&lt;div&gt;</code> — 意味を持たない「ただの箱」。区画タグが合わないときのグループ化に使う（ブロック=改行される）</li>
  <li><code>&lt;span&gt;</code> — 文章の一部分だけを囲む小さな箱（インライン=改行されない）。「この単語だけ色を変えたい」ときなどに使う</li>
</ul>
<div class="tip">💡 <strong>なぜdivだけで作らないのか？</strong> AIが生成するコードには <code>&lt;header&gt;</code> や <code>&lt;main&gt;</code> が必ず出てきます。意味のあるタグを使う書き方を「セマンティックHTML」と呼び、検索エンジン対策（SEO）とアクセシビリティの基本です。読めるようになっておくと、AIのコードがぐっと理解しやすくなります。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>マイサイト</title>
</head>
<body>
  <header>
    <h1>コハクのサイト</h1>
    <nav>
      <a href="#">ホーム</a>
      <a href="#">ブログ</a>
    </nav>
  </header>
  <main>
    <h2>ようこそ</h2>
    <p>ここは<span>メイン</span>のコンテンツです。</p>
    <div>
      <p>お知らせ: 毎週水曜はAIサークルの勉強会です。</p>
    </div>
  </main>
  <footer>
    <p>© 2026 Kohaku</p>
  </footer>
</body>
</html>`,
    challenge: {
      spec: "「部活紹介」ページを構造化して作ってください。<br>・headerの中に、h1でサークル名と、navの中にリンク2つ（href=\"#\"でOK）<br>・mainの中に、h2の見出しと段落1つ<br>・footerの中に、コピーライトの段落",
      allowed: ["<!DOCTYPE html>", "<html>", "<head>", "<meta>", "<title>", "<body>", "<header>", "<nav>", "<main>", "<footer>", "<h1>", "<h2>", "<p>", "<a href>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>部活紹介</title>
</head>
<body>
  <header>
    <h1>北大AIサークル</h1>
    <nav>
      <a href="#">活動内容</a>
      <a href="#">入会案内</a>
    </nav>
  </header>
  <main>
    <h2>私たちについて</h2>
    <p>毎週水曜日にAIの勉強会を開いています。</p>
  </main>
  <footer>
    <p>© 2026 北大AIサークル</p>
  </footer>
</body>
</html>`,
      checklist: [
        "header / main / footer で3つの区画に分けた",
        "navがheaderの中にあり、リンクを含んでいる",
        "mainの中に主要コンテンツ（h2と段落）を入れた",
      ],
    },
  },

  // ================= CSS =================
  {
    id: "css-01",
    unit: "css",
    title: "CSSの基本（セレクタとプロパティ）",
    explanation: `
<h3>CSSは「どれを・どうするか」の指示書</h3>
<p>CSSの文法はこれだけです。</p>
<pre><code>セレクタ {
  プロパティ: 値;
}</code></pre>
<ul>
  <li><strong>セレクタ</strong> — どの要素に適用するか（例: <code>h1</code> なら全部のh1）</li>
  <li><strong>プロパティ</strong> — 何を変えるか（例: <code>color</code> = 文字色）</li>
  <li><strong>値</strong> — どう変えるか（例: <code>red</code>）。行末の <code>;</code>（セミコロン）を忘れない</li>
</ul>

<h3>今回使うプロパティ</h3>
<ul>
  <li><code>color</code> — 文字の色。色名（red）や16進数（#2563eb）で指定</li>
  <li><code>background-color</code> — 背景色</li>
  <li><code>font-size</code> — 文字サイズ。<code>px</code>（ピクセル）単位が基本</li>
  <li><code>text-align</code> — 文字の揃え。<code>center</code> で中央揃え</li>
</ul>

<h3>class — 「あだ名」をつけて狙い撃ち</h3>
<p>「全部のpではなく、このpだけ変えたい」ときは、HTML側に <code>class="notice"</code> のように名前をつけ、CSS側で <code>.notice</code>（先頭にドット）と書いて狙い撃ちします。idと違い、<strong>classは同じ名前を何度使ってもOK</strong>です。</p>
<div class="tip">💡 今回はHTMLの&lt;head&gt;内に <code>&lt;style&gt;</code> タグで書きます。実務ではCSSを別ファイル（style.css）に分けて<code>&lt;link&gt;</code>で読み込むのが普通ですが、文法はまったく同じです。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>CSS入門</title>
  <style>
    h1 {
      color: #2563eb;
      text-align: center;
    }
    p {
      font-size: 18px;
    }
    .notice {
      color: white;
      background-color: #dc2626;
    }
  </style>
</head>
<body>
  <h1>CSSはじめました</h1>
  <p>この段落は18pxです。</p>
  <p class="notice">この段落だけ赤背景の白文字！</p>
</body>
</html>`,
    challenge: {
      spec: "スタイル付きの「お知らせ」ページを作ってください。<br>・h1を中央揃えにして、好きな色に変える<br>・classを1つ定義して（名前は自由）、背景色と文字色を設定<br>・段落を2つ書き、片方だけにそのclassをつける",
      allowed: ["<style>", "h1 { }", ".クラス名 { }", "color", "background-color", "font-size", "text-align", "class属性"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>お知らせ</title>
  <style>
    h1 {
      color: #16a34a;
      text-align: center;
    }
    .important {
      color: white;
      background-color: #2563eb;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <h1>お知らせ</h1>
  <p>今日は通常どおり活動します。</p>
  <p class="important">明日の勉強会は17時開始に変更！</p>
</body>
</html>`,
      checklist: [
        "セレクタ { プロパティ: 値; } の形で書けた（セミコロン忘れなし）",
        "classをドット付きで定義し、HTML側でclass属性をつけた",
        "classをつけた段落だけ見た目が変わった（プレビューで確認）",
      ],
    },
  },
  {
    id: "css-02",
    unit: "css",
    title: "ボックスモデル（padding / border / margin）",
    explanation: `
<h3>すべての要素は「箱」でできている</h3>
<p>HTMLの要素はすべて四角い箱です。箱には内側から順に4つの層があります。</p>
<pre><code>┌─ margin（外側の余白）──────────┐
│ ┌─ border（枠線）────────────┐ │
│ │ ┌─ padding（内側の余白）─┐ │ │
│ │ │      content（中身）     │ │ │
│ │ └───────────────┘ │ │
│ └─────────────────┘ │
└───────────────────┘</code></pre>
<ul>
  <li><code>padding</code> — 中身と枠線の間の余白。「箱の中のクッション」</li>
  <li><code>border</code> — 枠線。<code>太さ 種類 色</code> の3点セットで書く（例: <code>2px solid #333</code>）</li>
  <li><code>margin</code> — 箱の外側の余白。「隣の箱との距離」</li>
  <li><code>border-radius</code> — 角の丸み。大きくすると角丸カードになる</li>
</ul>

<h3>paddingとmarginの見分け方</h3>
<p>背景色は<strong>paddingまで</strong>塗られ、marginは塗られません。「背景色を広げたい→padding」「隣と離したい→margin」と覚えます。</p>
<div class="tip">💡 <code>padding: 16px;</code> は上下左右ぜんぶ16px。<code>padding: 8px 16px;</code> と2つ書くと「上下8px・左右16px」の意味になります。AIのコードに頻出する省略記法です。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ボックスモデル</title>
  <style>
    .card {
      background-color: #eff6ff;
      border: 2px solid #2563eb;
      border-radius: 8px;
      padding: 16px;
      margin: 12px;
    }
  </style>
</head>
<body>
  <h1>カードの練習</h1>
  <div class="card">
    <p>paddingで内側に余白ができる。</p>
  </div>
  <div class="card">
    <p>marginでカード同士が離れる。</p>
  </div>
</body>
</html>`,
    challenge: {
      spec: "「メモカード」を2枚並べたページを作ってください。<br>・cardというclassを定義する<br>・背景色・枠線（border）・角丸（border-radius）・内側余白（padding）・外側余白（margin）をすべて設定<br>・そのclassをつけたdivを2つ作り、中に段落を入れる",
      allowed: ["<style>", ".card { }", "background-color", "border", "border-radius", "padding", "margin", "<div class>", "<p>"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>メモカード</title>
  <style>
    .card {
      background-color: #fefce8;
      border: 1px solid #eab308;
      border-radius: 12px;
      padding: 16px;
      margin: 10px;
    }
  </style>
</head>
<body>
  <h1>今日のメモ</h1>
  <div class="card">
    <p>TOEFLの単語を30個覚えた。</p>
  </div>
  <div class="card">
    <p>HTMLのフォームを復習する。</p>
  </div>
</body>
</html>`,
      checklist: [
        "borderを「太さ 種類 色」の3点セットで書いた",
        "paddingとmarginの違いをプレビューで確認した（背景色が塗られるのはどっちまで？）",
        "カードが2枚、間隔をあけて表示された",
      ],
    },
  },
  {
    id: "css-03",
    unit: "css",
    title: "Flexboxで横並びレイアウト",
    explanation: `
<h3>「横に並べる」の現代の標準 = Flexbox</h3>
<p>divは通常、縦に積み重なります。横に並べたいときは、<strong>並べたい要素たちの「親」</strong>に <code>display: flex;</code> を指定します。すると子どもたちが自動で横一列に並びます。</p>
<pre><code>.container {
  display: flex;      /* 子どもを横並びにする */
  gap: 12px;          /* 子ども同士の間隔 */
  justify-content: center;  /* 横方向の配置 */
}</code></pre>

<h3>よく使うプロパティ（親につける）</h3>
<ul>
  <li><code>display: flex</code> — これがスイッチ。親につけるのがポイント</li>
  <li><code>gap</code> — 子要素どうしの間隔。marginより簡単で確実</li>
  <li><code>justify-content</code> — 横方向の揃え。<code>center</code>（中央寄せ）/ <code>space-between</code>（両端に広げる）が頻出</li>
  <li><code>align-items</code> — 縦方向の揃え。<code>center</code> で上下中央</li>
</ul>
<div class="tip">💡 <strong>間違いやすいポイント:</strong> flexは「並べたい要素そのもの」ではなく「その親」につけます。効かないときは、まず「つけた場所は親か？」を疑ってください。これはAIのコードのエラー原因調査でも定番のチェックポイントです。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Flexbox</title>
  <style>
    .container {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .box {
      background-color: #dbeafe;
      border: 1px solid #2563eb;
      border-radius: 8px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>横並びの練習</h1>
  <div class="container">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
  </div>
</body>
</html>`,
    challenge: {
      spec: "3つの「メニューカード」が横並びで中央に配置されたページを作ってください。<br>・親のdiv（class名は自由）に display: flex、gap、justify-content: center を設定<br>・子のカード（class名は自由）に背景色とpaddingとborder-radiusを設定<br>・カードの中身は「AI」「英語」「プログラミング」",
      allowed: ["<style>", "display: flex", "gap", "justify-content", "background-color", "padding", "border-radius", "<div class>"],
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
      background-color: #dcfce7;
      padding: 24px;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <h1>学習メニュー</h1>
  <div class="menu">
    <div class="item">AI</div>
    <div class="item">英語</div>
    <div class="item">プログラミング</div>
  </div>
</body>
</html>`,
      checklist: [
        "display: flex を「親」につけた（子ではなく）",
        "gapで間隔、justify-content: centerで中央寄せができた",
        "3枚のカードが横一列・中央に並んだ（プレビューで確認）",
      ],
    },
  },

  // ================= JavaScript =================
  {
    id: "js-01",
    unit: "js",
    title: "変数と計算・画面への出力",
    explanation: `
<h3>JavaScriptは「動き」を作る言語</h3>
<p>HTMLが骨組み、CSSが見た目、そしてJavaScript（JS）は<strong>計算し、判断し、画面を書き換える</strong>言語です。<code>&lt;body&gt;</code> の最後に <code>&lt;script&gt;</code> タグを置き、その中に書きます。</p>

<h3>変数 — 値に名前をつけた「入れ物」</h3>
<pre><code>const name = "コハク";   // 後で変更しない入れ物
let count = 0;            // 後で変更する入れ物
count = count + 1;        // 変更できる（constだとエラーになる）</code></pre>
<ul>
  <li><code>const</code> — 一度入れたら変えない変数。<strong>迷ったらconst</strong></li>
  <li><code>let</code> — 後から中身を変える変数</li>
  <li><code>//</code> — コメント。その行のそれ以降は実行されないメモ書き</li>
  <li>文字列は <code>"</code> で囲む。数値はそのまま書く。<code>+</code> は数値なら足し算、文字列ならつなげる（連結）</li>
</ul>

<h3>画面への出力</h3>
<pre><code>document.getElementById("output").textContent = "こんにちは";</code></pre>
<p>読み方: 「document（このページ）の中から、id が output の要素を取ってきて（getElementById）、その textContent（中の文字）を書き換える」。左から右へ、日本語に訳しながら読むのがコツです。</p>
<div class="tip">💡 JSは<strong>大文字と小文字を区別します</strong>。getElementByld（最後がエル小文字）のようなタイプミスは動きません。エラーの原因第1位はスペルミスです。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>変数の練習</title>
</head>
<body>
  <h1>自己紹介の自動生成</h1>
  <p id="output"></p>
  <script>
    const name = "コハク";
    const age = 20;
    const nextAge = age + 1;
    const message = name + "です。来年" + nextAge + "歳になります。";
    document.getElementById("output").textContent = message;
  </script>
</body>
</html>`,
    challenge: {
      spec: "「割り勘計算ページ」を作ってください。<br>・constで合計金額（total、例: 3000）と人数（people、例: 4）を定義<br>・1人あたりの金額を計算して変数に入れる（割り算は / ）<br>・id=\"output\" の段落に「1人あたり750円です」の形で表示する",
      allowed: ["<script>", "const", "+（連結）", "/（割り算）", "document.getElementById()", ".textContent"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>割り勘計算</title>
</head>
<body>
  <h1>割り勘計算</h1>
  <p id="output"></p>
  <script>
    const total = 3000;
    const people = 4;
    const perPerson = total / people;
    const message = "1人あたり" + perPerson + "円です";
    document.getElementById("output").textContent = message;
  </script>
</body>
</html>`,
      checklist: [
        "constで変数を定義し、計算結果も変数に入れた",
        "getElementByIdのスペルを1文字も間違えていない",
        "プレビューに計算結果の文章が表示された",
      ],
    },
  },
  {
    id: "js-02",
    unit: "js",
    title: "条件分岐（if）と関数（function）",
    explanation: `
<h3>if — 条件によって処理を変える</h3>
<pre><code>if (score >= 80) {
  // 条件が真（true）のとき実行
} else {
  // それ以外のとき実行
}</code></pre>
<p>比較には専用の記号を使います: <code>&gt;=</code>（以上）、<code>&lt;=</code>（以下）、<code>===</code>（等しい）、<code>!==</code>（等しくない）。<strong>「等しい」は = が3つ</strong>です。<code>=</code> 1つは「代入」なので別物です。</p>

<h3>function — 処理に名前をつけて再利用する</h3>
<pre><code>function judge(score) {
  if (score >= 80) {
    return "合格";
  } else {
    return "不合格";
  }
}

const result = judge(85);   // "合格" が返ってくる</code></pre>
<ul>
  <li><code>score</code> は「引数（ひきすう）」— 関数に渡す材料</li>
  <li><code>return</code> — 関数の答えを呼び出し元に返す。returnした瞬間に関数は終了する</li>
  <li><code>judge(85)</code> のように書くと関数が実行される（「呼び出し」）</li>
</ul>
<div class="tip">💡 関数は「レシピ」です。judge というレシピを一度書けば、judge(85)でもjudge(60)でも、材料を変えて何度でも使い回せます。同じコードを2回書きそうになったら関数にする、が上達のコツです。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>合否判定</title>
</head>
<body>
  <h1>テストの合否判定</h1>
  <p id="output"></p>
  <script>
    function judge(score) {
      if (score >= 80) {
        return score + "点: 合格！";
      } else {
        return score + "点: 不合格…";
      }
    }
    const result = judge(85);
    document.getElementById("output").textContent = result;
  </script>
</body>
</html>`,
    challenge: {
      spec: "「TOEFLスコア判定」ページを作ってください。<br>・スコアを受け取る関数 checkScore を定義<br>・80以上なら「目標達成！」、それ以外なら「あと○点」（80 - スコア で計算）を返す<br>・checkScore(53) の結果を id=\"output\" に表示する",
      allowed: ["<script>", "function", "if / else", ">=", "return", "-（引き算）", "+（連結）", "document.getElementById()", ".textContent"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>スコア判定</title>
</head>
<body>
  <h1>TOEFLスコア判定</h1>
  <p id="output"></p>
  <script>
    function checkScore(score) {
      if (score >= 80) {
        return "目標達成！";
      } else {
        return "あと" + (80 - score) + "点";
      }
    }
    const result = checkScore(53);
    document.getElementById("output").textContent = result;
  </script>
</body>
</html>`,
      checklist: [
        "functionで関数を定義し、引数を受け取った",
        "if / else の両方の場合でreturnした",
        "「あと27点」とプレビューに表示された",
      ],
    },
  },
  {
    id: "js-03",
    unit: "js",
    title: "イベント — ボタンに命を吹き込む",
    explanation: `
<h3>イベント = 「〇〇が起きたら△△する」</h3>
<p>クリック、キー入力、スクロール…ユーザーの操作を「イベント」と呼びます。JSの真骨頂は、イベントに反応して画面を書き換えることです。</p>
<pre><code>const btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  // クリックされるたびに、ここが実行される
});</code></pre>
<p>読み方: 「btnに、イベント聞き耳係（EventListener）を追加する。聞き耳する対象は click。聞こえたらこの関数を実行する」。ここで渡している名前のない関数を「無名関数」と呼びます。</p>

<h3>カウンターの仕組み</h3>
<ol>
  <li><code>let count = 0;</code> — 回数を覚えておく変数（変化するのでlet）</li>
  <li>クリックされたら <code>count = count + 1;</code> で1増やす</li>
  <li>増えた値を textContent で画面に反映する</li>
</ol>
<div class="tip">💡 <strong>ここまでの総復習です。</strong> HTML（button, p, id）、変数（let/const）、関数、DOM操作（getElementById）のすべてが1つにつながります。この型は、いいね機能・カート・フォーム送信など、あらゆるWebアプリの原型です。</div>
`,
    model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カウンター</title>
</head>
<body>
  <h1>クリックカウンター</h1>
  <p id="count-display">0回</p>
  <button id="btn">クリック！</button>
  <script>
    let count = 0;
    const btn = document.getElementById("btn");
    const display = document.getElementById("count-display");
    btn.addEventListener("click", function () {
      count = count + 1;
      display.textContent = count + "回";
    });
  </script>
</body>
</html>`,
    challenge: {
      spec: "「今日のやる気メーター」を作ってください。<br>・「やる気+10」というボタンと、数値を表示する段落（初期値「0%」）<br>・ボタンを押すたびに10ずつ増えて「10%」「20%」…と表示が更新される<br>・letとaddEventListenerを使う",
      allowed: ["<button id>", "<p id>", "<script>", "let", "const", "document.getElementById()", ".addEventListener(\"click\", ...)", ".textContent", "+（足し算・連結）"],
      model: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>やる気メーター</title>
</head>
<body>
  <h1>今日のやる気メーター</h1>
  <p id="meter">0%</p>
  <button id="up">やる気+10</button>
  <script>
    let power = 0;
    const btn = document.getElementById("up");
    const meter = document.getElementById("meter");
    btn.addEventListener("click", function () {
      power = power + 10;
      meter.textContent = power + "%";
    });
  </script>
</body>
</html>`,
      checklist: [
        "変化する数値をletで、変化しない要素の参照をconstで宣言した",
        "addEventListenerの第1引数が\"click\"になっている",
        "プレビューでボタンを押すと10%ずつ増える（実際に押して確認！）",
      ],
    },
  },
];
