// 教材データ(3/3): Next.js / React Native

const NEXT_NOTE = 'Next.jsは本来サーバーで動くフレームワーク。道場ではこのファイルのコンポーネントだけを取り出して疑似実行します（要ネット接続）。本物の環境構築は卒業後に「npx create-next-app」で。';
const RN_NOTE = '本物はExpoを使いスマホ実機で動かします。道場ではスマホ画面を再現したシミュレーターで疑似実行します（要ネット接続）。';

LESSONS.push(
  // ================= Next.js =================
  {
    id: "next-01",
    unit: "next",
    title: "Next.jsとは・ファイルがそのままURLになる",
    previewMode: "react",
    mount: "Home",
    scaffoldNote: NEXT_NOTE,
    filename: "app/page.tsx",
    explanation: `
<h3>なぜReactだけでは足りないのか</h3>
<p>Reactは「部品を作る道具」であって、Webサイトに必要な<strong>ページ分け（URL）・高速表示・検索エンジン対応（SEO）</strong>は自分で組む必要があります。それらを全部込みで提供するのが<strong>Next.js</strong>——Reactチーム公認、実務のデファクトスタンダードのフレームワークです。求人・AIが生成するコード、どちらでも「React単体」より「Next.js」の形で出会うことが多いはずです。</p>

<h3>ファイルベースルーティング — フォルダ構成がそのままURL</h3>
<p>Next.js最大の発明。<strong>app フォルダの中に page.tsx を置くと、その場所がURLになります</strong>。設定ファイル不要。</p>
<pre><code>app/
├── page.tsx           → /          （トップページ）
├── about/
│   └── page.tsx       → /about    （フォルダ名がURLに）
└── blog/
    └── page.tsx       → /blog</code></pre>
<p>ルールは2つだけ:</p>
<ul>
  <li>ファイル名は必ず <code>page.tsx</code>（フォルダ名がURLを決める）</li>
  <li>コンポーネントを <code>export default</code> する（名前はHome、Aboutなど自由）</li>
</ul>

<h3>中身はただのReactコンポーネント</h3>
<p>下の手本を見てください——React編で学んだ「JSXを返す関数」そのものです。<strong>Reactを学んだあなたはNext.jsの中身をもう書けます</strong>。新しいのは「どこに置くか」のルールだけ。</p>
<div class="tip">💡 AIに「◯◯のサイトを作って」と頼むと、ほぼ確実に app/ フォルダ構成のNext.jsコードが返ってきます。「page.tsxはURLに対応するページ」と知っているだけで、生成されたプロジェクトの全体像が読めるようになります。</div>
`,
    model: `export default function Home() {
  return (
    <main>
      <h1>コハクのポートフォリオ</h1>
      <p>Next.jsで作る私のホームページです。</p>
      <p>このファイルが「/」のページになります。</p>
    </main>
  );
}`,
    challenge: {
      mount: "Profile",
      spec: "「/profile」ページを作ってください。<br>・ファイルは app/profile/page.tsx に置く想定（このURLになる理由を説明できるように）<br>・Profile という名前のコンポーネントを export default で定義<br>・mainの中に、h1で「プロフィール」、段落で自己紹介を1つ",
      allowed: ["export default function Profile()", "<main>", "<h1>", "<p>", "JSX"],
      model: `export default function Profile() {
  return (
    <main>
      <h1>プロフィール</h1>
      <p>北大でAIを学びながら、Webエンジニアを目指しています。</p>
    </main>
  );
}`,
      checklist: [
        "app/profile/page.tsx に置けば /profile になる理由（フォルダ名=URL）を説明できる",
        "export default を付けた（これがないとNext.jsがページと認識しない）",
        "中身はReact編で学んだ普通のコンポーネントだと実感した",
      ],
    },
  },
  {
    id: "next-02",
    unit: "next",
    title: "Linkとlayout — サイト共通の枠を作る",
    previewMode: "react",
    mount: "RootLayout",
    mountChildren: "（ここに各ページの中身が入ります）",
    scaffoldNote: NEXT_NOTE,
    filename: "app/layout.tsx",
    explanation: `
<h3>&lt;Link&gt; — ページ移動を高速にする専用タグ</h3>
<pre><code>import Link from "next/link";
&lt;Link href="/about"&gt;自己紹介へ&lt;/Link&gt;</code></pre>
<p>HTML-03の &lt;a&gt; タグはクリックのたびに<strong>ページ全体を読み込み直します</strong>（画面が一瞬白くなる）。Next.jsの &lt;Link&gt; は<strong>変わる部分だけを差し替える</strong>ので、アプリのようにヌルヌル動きます。書き方は &lt;a&gt; とほぼ同じで href に飛び先を書くだけ。<strong>Next.js内のページ移動はLink、外部サイトへはa</strong>、と使い分けます。</p>

<h3>layout.tsx — 全ページ共通の「額縁」</h3>
<p>ヘッダーやフッターを全ページにコピペするのは最悪の設計です（1箇所直すたび全ページ修正）。Next.jsでは <code>app/layout.tsx</code> に共通の枠を1回だけ書きます。</p>
<pre><code>app/
├── layout.tsx   ← 共通の枠（ヘッダー・フッター）
├── page.tsx     ← / の中身
└── about/
    └── page.tsx ← /about の中身</code></pre>

<h3>children — 「ここに中身が入る」という特別なprops</h3>
<pre><code>function RootLayout({ children }) {
  return (
    &lt;div&gt;
      &lt;header&gt;共通ヘッダー&lt;/header&gt;
      &lt;main&gt;{children}&lt;/main&gt;   ← 各page.tsxがここに差し込まれる
    &lt;/div&gt;
  );
}</code></pre>
<p><code>children</code> はReactに元からある特別なprops——「タグで挟んだ中身」を受け取ります。layoutでは「現在表示中のページ」がchildrenとして届きます。型は <code>React.ReactNode</code>（JSXなら何でも）です。</p>
<div class="tip">💡 HTML-05で学んだ header / main / footer の構造化タグが、そのままlayoutの設計に活きます。「共通部分はlayoutへ、ページ固有部分はpageへ」——この分担がNext.jsの読み解きの第一歩です。</div>
`,
    model: `import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ borderBottom: "1px solid #94a3b8", padding: "8px" }}>
        <Link href="/">ホーム</Link> | <Link href="/profile">プロフィール</Link>
      </header>
      <main>{children}</main>
    </div>
  );
}`,
    challenge: {
      mount: "RootLayout",
      spec: "フッター付きのlayoutを作ってください。<br>・importから書き始め、RootLayout を export default で定義（childrenを受け取る）<br>・header: Linkを2つ（href=\"/\" と href=\"/blog\"）<br>・main: {children} を差し込む<br>・footer: 「© 2026 Kohaku」の段落",
      allowed: ["import Link from \"next/link\"", "{ children }: { children: React.ReactNode }", "<Link href=...>", "<header> <main> <footer>", "{children}", "export default"],
      model: `import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <Link href="/">ホーム</Link> | <Link href="/blog">ブログ</Link>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2026 Kohaku</p>
      </footer>
    </div>
  );
}`,
      checklist: [
        "Linkとaタグの違い（全体再読込か、差し替えか）を説明できる",
        "childrenが「各ページの中身の差し込み口」だと説明できる",
        "共通部分をlayoutに書く理由（修正が1箇所で済む）を説明できる",
      ],
    },
  },
  {
    id: "next-03",
    unit: "next",
    title: "\"use client\" — サーバーとブラウザ、どっちで動く？",
    previewMode: "react",
    mount: "CounterPage",
    scaffoldNote: NEXT_NOTE,
    filename: "app/counter/page.tsx",
    explanation: `
<h3>Next.jsのコンポーネントは、標準では「サーバー」で動く</h3>
<p>Next.jsの大発明その2。コンポーネントを<strong>サーバー側で実行してHTMLを完成させてから</strong>ブラウザに届けます（サーバーコンポーネント）。利点は、表示が速い・検索エンジンに強い・データベースに直接アクセスできる、の3つです。</p>

<h3>でも「動き」はブラウザにしか作れない</h3>
<p>useState・onClick・入力欄——ユーザーの操作に反応する仕事は、ユーザーの手元（ブラウザ）でしか実行できません。そこで、<strong>ファイルの先頭に1行</strong>書きます:</p>
<pre><code>"use client";</code></pre>
<p>この宣言があるファイルは「クライアント（ブラウザ）で動かす部品」になり、useStateやonClickが解禁されます。</p>

<h3>使い分けの判断基準</h3>
<table>
<tr><th>コンポーネントの性質</th><th>種類</th></tr>
<tr><td>表示するだけ（記事・一覧・プロフィール）</td><td>サーバー（そのまま）</td></tr>
<tr><td>触ると反応する（ボタン・フォーム・タブ）</td><td>"use client" を付ける</td></tr>
</table>

<h3>AIコードのエラー第1位がこれ</h3>
<pre><code>Error: useState only works in Client Components.
Add the "use client" directive at the top of the file.
→「useStateはClient Component専用です。ファイルの先頭に "use client" を足してください」</code></pre>
<p>AIが生成したNext.jsコードが動かないとき、原因のトップがこの付け忘れです。<strong>このエラー文が読めてしまえば、直し方は1行足すだけ</strong>。エラーを恐れる必要がなくなります。</p>
`,
    model: `"use client";

import { useState } from "react";

export default function CounterPage() {
  const [likes, setLikes] = useState<number>(0);

  return (
    <main>
      <h1>いいねボタン</h1>
      <p>{likes} いいね</p>
      <button onClick={() => setLikes(likes + 1)}>❤️ いいね</button>
    </main>
  );
}`,
    challenge: {
      mount: "TextPage",
      spec: "「/text」に文字数カウンターページを作ってください。<br>・useStateとonChangeを使うので、必要な宣言をファイル先頭に忘れずに<br>・TextPage を export default で定義<br>・入力欄（value / onChange）と、「今◯文字」と表示する段落（.lengthを使う）",
      allowed: ["\"use client\"", "import { useState } from \"react\"", "useState<string>(\"\")", "value= / onChange=", "e.target.value", "{text.length}", "export default"],
      model: `"use client";

import { useState } from "react";

export default function TextPage() {
  const [text, setText] = useState<string>("");

  return (
    <main>
      <h1>文字数カウンター</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>今{text.length}文字</p>
    </main>
  );
}`,
      checklist: [
        "\"use client\" をファイルの1行目に書いた（なぜ必要かも説明できる）",
        "サーバー/クライアントの使い分け基準（表示だけ？触って動く？）を説明できる",
        "プレビューで入力すると文字数がリアルタイムに変わる",
      ],
    },
  },
  {
    id: "next-04",
    unit: "next",
    title: "サーバーでのデータ取得 — async/awaitとfetch",
    previewMode: "react",
    mount: "TodoPage",
    asyncMount: true,
    scaffoldNote: NEXT_NOTE + " このレッスンは外部のテスト用API（jsonplaceholder）からデータを取得するため、特にネット接続が必要です。",
    filename: "app/todo/page.tsx",
    explanation: `
<h3>async / await — 「時間のかかる処理を待つ」文法</h3>
<p>ネット越しのデータ取得は一瞬では終わりません（数百ミリ秒の旅）。JSは待っている間も先に進んでしまう言語なので、「<strong>ここは結果が届くまで待って</strong>」と明示するのが <code>await</code>、awaitを使う関数の印が <code>async</code> です。</p>
<pre><code>async function getData() {
  const res = await fetch("https://...");  // 届くまで待つ
  const data = await res.json();           // JSON→オブジェクト変換も待つ
  return data;
}</code></pre>
<ul>
  <li><code>fetch(URL)</code> — URLにリクエストを送る組み込み関数</li>
  <li><code>res.json()</code> — 返ってきたJSON（データの共通記法）をJSのオブジェクトに変換</li>
  <li>そのオブジェクトの形は、<strong>TS-03のinterfaceで宣言しておく</strong>——どんなデータが来るかコードが仕様書になる</li>
</ul>

<h3>サーバーコンポーネントなら、ページが直接データを取れる</h3>
<p>Next.jsのサーバーコンポーネントは<strong>関数そのものをasyncにでき、コンポーネント内で直接awaitできます</strong>。</p>
<pre><code>export default async function Page() {
  const res = await fetch("https://...");
  const data = await res.json();
  return &lt;p&gt;{data.title}&lt;/p&gt;;
}</code></pre>
<p>「データを取ってから、HTMLを完成させて届ける」がこれだけで書ける——React単体時代は何行も儀式が必要だった処理で、Next.jsが劇的に簡単にした部分です。</p>
<div class="tip">💡 練習に使う jsonplaceholder.typicode.com は「開発練習用の無料フェイクAPI」。実在のToDoデータ風のJSONを返してくれる、世界中の入門者が使う定番サービスです。AIコードのサンプルにも頻繁に登場します。</div>
`,
    model: `interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default async function TodoPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const todo: Todo = await res.json();

  return (
    <main>
      <h1>外部データの表示</h1>
      <p>タイトル: {todo.title}</p>
      <p>完了: {todo.completed ? "済" : "未"}</p>
    </main>
  );
}`,
    challenge: {
      mount: "UserPage",
      asyncMount: true,
      spec: "ユーザー情報ページを作ってください。<br>・interface User を定義: name（string）と email（string）<br>・async な UserPage を export default で定義<br>・https://jsonplaceholder.typicode.com/users/1 からfetchで取得<br>・名前とメールアドレスを段落で表示",
      allowed: ["interface", "export default async function", "await fetch(URL)", "await res.json()", ": User", "{user.name}", "JSX"],
      model: `interface User {
  name: string;
  email: string;
}

export default async function UserPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user: User = await res.json();

  return (
    <main>
      <h1>ユーザー情報</h1>
      <p>名前: {user.name}</p>
      <p>メール: {user.email}</p>
    </main>
  );
}`,
      checklist: [
        "asyncとawaitの関係（awaitを使う関数にasyncを付ける）を説明できる",
        "fetch → res.json() の2段階それぞれにawaitを付けた",
        "届くデータの形をinterfaceで宣言した",
      ],
    },
  },

  // ================= React Native =================
  {
    id: "rn-01",
    unit: "rn",
    title: "View・Text・StyleSheet — スマホ画面の基本部品",
    previewMode: "rn",
    scaffoldNote: RN_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>React Native = Reactの知識でiOS/Androidアプリを作る</h3>
<p>ここまで学んだReact（コンポーネント・props・useState）が、<strong>そのままスマホアプリ開発に使えます</strong>。違いは「HTMLタグの代わりに、スマホ専用の部品を使う」ことだけ。1つのコードでiPhoneとAndroid両方のアプリになります（メルカリ、Discord等もこの技術）。</p>

<h3>Web部品 → RN部品の対応表</h3>
<table>
<tr><th>Web（HTML）</th><th>React Native</th><th>役割</th></tr>
<tr><td>&lt;div&gt;</td><td>&lt;View&gt;</td><td>箱・レイアウト</td></tr>
<tr><td>&lt;p&gt; &lt;h1&gt; &lt;span&gt;</td><td>&lt;Text&gt;</td><td>文字（後述の注意あり）</td></tr>
<tr><td>&lt;button&gt;</td><td>&lt;Button&gt; など</td><td>ボタン（次レッスン）</td></tr>
<tr><td>&lt;input&gt;</td><td>&lt;TextInput&gt;</td><td>入力欄（最終レッスン）</td></tr>
</table>
<p><strong>最重要ルール: 文字は必ず &lt;Text&gt; で包む。</strong> Viewの中に生の文字を直接書くとエラーになります（Webとの一番の違い。AIコードのRNエラーでも頻出）。</p>

<h3>StyleSheet — CSSファイルの代わり</h3>
<pre><code>const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
});
// 使う側: &lt;View style={styles.container}&gt;</code></pre>
<p>CSSファイルはなく、<strong>スタイルもJSのオブジェクト</strong>で書きます。プロパティ名はキャメルケース（font-size → fontSize）、数値は単位なし（24 = 24ポイント相当）。</p>
<div class="tip">💡 RNのレイアウトは<strong>標準で全部Flexbox</strong>（CSS-03の知識がフル稼働）。ただしWebと違い flexDirection の初期値が「column（縦積み）」です。<code>flex: 1</code> は「使える空間いっぱいに広がる」の意味で、画面全体を使う container の定番指定です。</div>
`,
    model: `import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>マイアプリ</Text>
      <Text style={styles.body}>React Nativeで作る初めての画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#eff6ff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e3a8a" },
  body: { fontSize: 14, marginTop: 8 },
});`,
    challenge: {
      spec: "プロフィール画面を作ってください。<br>・importから書き始める（View, Text, StyleSheet）<br>・container: flex: 1、padding、背景色を設定<br>・名前を大きく太字で、その下に一言コメントを表示<br>・スタイルは必ずStyleSheet.createで定義",
      allowed: ["import { View, Text, StyleSheet } from \"react-native\"", "<View style={}>", "<Text style={}>", "StyleSheet.create({})", "flex: 1", "fontSize / fontWeight / color / padding", "export default"],
      model: `import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>コハク</Text>
      <Text style={styles.comment}>AIとともに学ぶ大学生</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fefce8" },
  name: { fontSize: 28, fontWeight: "bold" },
  comment: { fontSize: 14, marginTop: 8, color: "#6b7280" },
});`,
      checklist: [
        "文字をすべて<Text>で包んだ（Viewに生文字を書いていない）",
        "スタイルをStyleSheet.createのオブジェクトで書けた（単位なし数値）",
        "flex: 1 の意味（空間いっぱいに広がる）を説明できる",
      ],
    },
  },
  {
    id: "rn-02",
    unit: "rn",
    title: "タップと状態 — onPressとuseState",
    previewMode: "rn",
    scaffoldNote: RN_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>クリックではなくタップ — onClick は onPress になる</h3>
<p>スマホに「クリック」はないので、イベント名が変わります: <code>onClick</code> → <code>onPress</code>。それ以外の考え方はReactと同一です。</p>

<h3>ボタンは2種類</h3>
<ul>
  <li><code>&lt;Button title="送信" onPress={...} /&gt;</code> — OS標準の見た目のボタン。文字は<strong>title属性</strong>で渡す（タグで挟まない）点がWebと違う</li>
  <li><code>&lt;TouchableOpacity style={...} onPress={...}&gt;</code> — <strong>何でもタップ可能にする箱</strong>。中に好きなView/Textを入れて自由なデザインのボタンを作る。実務・AIコードではこちらが主流</li>
</ul>

<h3>useStateはReactと100%同じ</h3>
<pre><code>const [count, setCount] = useState&lt;number&gt;(0);
&lt;TouchableOpacity onPress={() =&gt; setCount(count + 1)}&gt;</code></pre>
<p>state・set関数・再レンダリング——React-03で学んだ心臓部が、輸入元も同じ <code>import { useState } from "react"</code> のまま動きます。<strong>「Reactを学んだ人はRNの8割をすでに知っている」</strong>と言われる理由です。</p>
<div class="tip">💡 手本のstyles.buttonにある <code>borderRadius: 999</code> は「丸ボタン」を作る定番テクニック、<code>alignItems: "center"</code> はFlexboxの「横方向センタリング」（CSS-03の知識）です。学んだことが全部つながっていきます。</div>
`,
    model: `import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>タップ！</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  number: { fontSize: 48, fontWeight: "bold" },
  button: { backgroundColor: "#2563eb", padding: 16, borderRadius: 999, marginTop: 16 },
  buttonText: { color: "white", fontSize: 18 },
});`,
    challenge: {
      spec: "やる気メーターのスマホアプリ版を作ってください（React-03の挑戦課題のRN版）。<br>・タップするたび10増える%表示（useState）<br>・ボタンはTouchableOpacityで自作デザイン（背景色・padding・角丸）<br>・数値は大きく表示、画面中央寄せ（alignItems / justifyContent）",
      allowed: ["import { useState } from \"react\"", "import { View, Text, TouchableOpacity, StyleSheet } from \"react-native\"", "useState<number>(0)", "onPress={() => ...}", "StyleSheet.create", "alignItems / justifyContent"],
      model: `import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [power, setPower] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.meter}>{power}%</Text>
      <TouchableOpacity style={styles.button} onPress={() => setPower(power + 10)}>
        <Text style={styles.buttonText}>やる気+10</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  meter: { fontSize: 40, fontWeight: "bold" },
  button: { backgroundColor: "#16a34a", padding: 14, borderRadius: 999, marginTop: 12 },
  buttonText: { color: "white", fontSize: 16 },
});`,
      checklist: [
        "onClickではなくonPressを使った",
        "TouchableOpacityの中のテキストをTextで包んだ",
        "同じアプリをWeb（React-03）とスマホ（今回）両方で書けたことを実感した",
      ],
    },
  },
  {
    id: "rn-03",
    unit: "rn",
    title: "TextInputとFlatList — メモアプリで卒業制作",
    previewMode: "rn",
    scaffoldNote: RN_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>TextInput — スマホの入力欄</h3>
<pre><code>&lt;TextInput value={text} onChangeText={setText} placeholder="メモを入力" /&gt;</code></pre>
<p>Webのinputとの違いはイベント名: <code>onChange</code> → <code>onChangeText</code>。しかも<strong>入力文字列がそのまま渡ってくる</strong>ので、<code>e.target.value</code> の取り出しが不要になり、set関数を直接渡せます（onChangeText={setText}）。Webより簡潔です。</p>

<h3>FlatList — スマホ専用の高性能リスト</h3>
<pre><code>&lt;FlatList
  data={memos}                          // 表示する配列
  keyExtractor={(item, index) =&gt; String(index)}  // keyの作り方
  renderItem={({ item }) =&gt; &lt;Text&gt;{item}&lt;/Text&gt;}  // 1件分の見た目
/&gt;</code></pre>
<p>React-04のmapでも表示はできますが、メモが1万件あったら1万個描画してしまいます。FlatListは<strong>画面に見えている分だけを描画する（仮想化）</strong>ため、大量データでもスクロールが軽い——スマホアプリの体感品質を決める重要部品です。mapとの対応: data=配列、renderItem=mapの中身、keyExtractor=key属性。</p>

<h3>卒業制作 — 全カリキュラムがこの1画面に</h3>
<p>手本のメモアプリには、これまでの<strong>すべて</strong>が入っています: 構造化（HTML）→ Flexboxとスタイル設計（CSS）→ 関数とガード節（JS）→ 型注釈とジェネリクス（TS）→ useState・制御コンポーネント・スプレッド構文（React）→ そしてスマホ部品（RN）。<strong>これを写して・見ずに書けたら、カリキュラム完走です。</strong></p>
<div class="tip">🎓 卒業後の道: 「npx create-expo-app」で本物のRN環境を作りスマホ実機で動かす／「npx create-next-app」でNext.jsサイトを公開する。どちらもAIに手伝わせながら進めれば、あなたはもう<strong>コードが読めてエラーの原因が特定できる</strong>——当初の目標を達成した状態で挑めます。</div>
`,
    model: `import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

export default function App() {
  const [text, setText] = useState<string>("");
  const [memos, setMemos] = useState<string[]>([]);

  const addMemo = () => {
    if (text === "") return;
    setMemos([...memos, text]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>メモアプリ</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="メモを入力"
      />
      <Button title="追加" onPress={addMemo} />
      <FlatList
        data={memos}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <Text style={styles.memo}>・{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#94a3b8", borderRadius: 6, padding: 8, marginVertical: 8 },
  memo: { fontSize: 16, paddingVertical: 4 },
});`,
    challenge: {
      spec: "卒業制作:「今日やったことログ」アプリを何も見ずに作ってください。<br>・入力欄（TextInput）＋「記録」ボタン（Button）。空文字は追加しない<br>・記録した件数を「◯件達成」とTextで表示（.length）<br>・一覧はFlatListで表示（data / keyExtractor / renderItem）<br>・スタイルはStyleSheet.createで最低3つ定義",
      allowed: ["useState<string> / useState<string[]>", "TextInput（value / onChangeText / placeholder）", "Button（title / onPress）", "FlatList（data / keyExtractor / renderItem)", "[...配列, 追加分]", "if (...) return;", ".length", "StyleSheet.create"],
      model: `import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

export default function App() {
  const [text, setText] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = () => {
    if (text === "") return;
    setLogs([...logs, text]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>今日やったことログ</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="やったことを入力"
      />
      <Button title="記録" onPress={addLog} />
      <Text style={styles.count}>{logs.length}件達成</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <Text style={styles.log}>✅ {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#94a3b8", borderRadius: 6, padding: 8, marginVertical: 8 },
  count: { fontSize: 14, marginVertical: 6, color: "#16a34a" },
  log: { fontSize: 16, paddingVertical: 4 },
});`,
      checklist: [
        "onChangeTextにset関数を直接渡せる理由（文字列がそのまま来る）を説明できる",
        "FlatListの3点セット（data / keyExtractor / renderItem）をmapと対応づけて説明できる",
        "🎓 プレビューで入力→記録→一覧表示まで動いたら、カリキュラム完走おめでとう！",
      ],
    },
  }
);
