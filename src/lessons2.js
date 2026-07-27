// 教材データ(2/3): TypeScript / React

const TS_SCAFFOLD = '<h1 style="font-size:20px">実行結果</h1><p id="output" style="font-size:16px"></p>';
const TS_NOTE = '前提: 画面には <code>&lt;p id="output"&gt;&lt;/p&gt;</code> が用意済み。あなたはTypeScriptだけを書きます（道場が自動でJSに変換して実行）。';
const REACT_NOTE = 'import や export default は本物のプロジェクトの書き方のまま書いてOK。道場が自動でブラウザ用に変換して実行します。';

LESSONS.push(
  // ================= TypeScript =================
  {
    id: "ts-01",
    unit: "ts",
    title: "型とは何か・基本の型注釈",
    previewMode: "ts",
    scaffold: TS_SCAFFOLD,
    scaffoldNote: TS_NOTE,
    filename: "main.ts",
    explanation: `
<h3>TypeScript = JavaScript + 型</h3>
<p>TypeScript（TS）は、JSに<strong>「型」という安全装置</strong>を足した言語です。書いたTSは最終的にJSに変換されて動くので、<strong>JSの知識はすべてそのまま使えます</strong>。ファイルの拡張子は <code>.js</code> → <code>.ts</code> になります。</p>
<p>型とは「<strong>この変数に入れていい値の種類の約束</strong>」です。変数名の後ろに <code>: 型名</code> を付けて宣言します。</p>
<pre><code>const userName: string = "コハク";   // 文字列しか入れない約束
const score: number = 85;             // 数値しか入れない約束
const isPassed: boolean = true;       // true/falseしか入れない約束</code></pre>

<h3>なぜ型が必要か — エラーを「実行前」に見つける</h3>
<p>JSでは <code>score = "たくさん"</code> のような間違いに、<strong>実行して壊れて初めて</strong>気づきます。TSなら書いた瞬間にエディタ（VSCode）が赤線で教えてくれます。エラーメッセージはこう読みます:</p>
<pre><code>Type 'string' is not assignable to type 'number'.
→「string型は、number型（の変数）に代入できません」</code></pre>
<p>AIが書いたコードのエラーの多くはこの形式で報告されます。<strong>型エラーが日本語に訳せる＝エラー原因が特定できる</strong>、が今ユニットの最重要スキルです。</p>

<h3>! （非nullアサーション）— AIコード頻出記号</h3>
<pre><code>document.getElementById("output")!.textContent = "...";</code></pre>
<p>TSは <code>getElementById</code> の結果を「要素、<strong>または null かもしれない</strong>」型と考え、そのままだと「nullだったらどうするの？」とエラーにします。<code>!</code> は「<strong>絶対にnullじゃないから信じて</strong>」とTSに伝える記号です。</p>
<div class="tip">💡 この道場のプレビューは「型を消してJSとして実行」する仕組みなので、型の間違いでは止まりません。型エラーの赤線を体験するのは、後日VSCodeを導入したときのお楽しみ。ここでは<strong>型注釈を正しく読める・書ける</strong>ことに集中します。</div>
`,
    model: `const userName: string = "コハク";
const score: number = 85;
const isPassed: boolean = score >= 80;

const message: string =
  userName + "さん: " + score + "点（合格: " + isPassed + "）";

document.getElementById("output")!.textContent = message;`,
    challenge: {
      spec: "商品情報を型付きで表示してください。<br>・商品名（string型）・価格（number型）・在庫あり（boolean型）の3変数を、型注釈付きのconstで宣言<br>・「りんご: 150円（在庫: true）」の形の文字列を組み立てて、outputに表示<br>・getElementByIdには ! を付ける",
      allowed: ["const", ": string", ": number", ": boolean", "+（連結）", "document.getElementById()!", ".textContent"],
      model: `const itemName: string = "りんご";
const price: number = 150;
const inStock: boolean = true;

const message: string =
  itemName + ": " + price + "円（在庫: " + inStock + "）";

document.getElementById("output")!.textContent = message;`,
      checklist: [
        "3つの変数すべてに : string / : number / : boolean の型注釈を付けた",
        "getElementById(...)! の ! の意味（nullじゃないと約束）を説明できる",
        "プレビューに組み立てた文字列が表示された",
      ],
    },
  },
  {
    id: "ts-02",
    unit: "ts",
    title: "関数の型（引数・戻り値・省略可能）",
    previewMode: "ts",
    scaffold: TS_SCAFFOLD,
    scaffoldNote: TS_NOTE,
    filename: "main.ts",
    explanation: `
<h3>関数こそ型の主戦場</h3>
<p>型が一番役立つのは<strong>関数の出入り口</strong>です。「何を渡すべきか（引数）」「何が返ってくるか（戻り値）」が型で明記されていれば、<strong>関数の中身を読まなくても使い方がわかります</strong>。AIが書いた長いコードを読むとき、まず関数の1行目（シグネチャ）だけ拾い読みする——これがプロの読み方です。</p>
<pre><code>function calcPrice(base: number, taxRate: number): number {
//                 ↑引数の型          ↑引数の型      ↑戻り値の型
  return Math.round(base * taxRate);
}</code></pre>
<p><code>Math.round()</code> は四捨五入の組み込み関数です。何も返さない関数の戻り値型は <code>void</code> と書きます。</p>

<h3>省略できる引数 — ? とデフォルト値</h3>
<ul>
  <li><code>title?: string</code> — <strong>?</strong> を付けると「渡しても渡さなくてもいい」引数になる。渡されなかったときの中身は <code>undefined</code></li>
  <li><code>taxRate: number = 1.1</code> — <strong>デフォルト値</strong>。渡されなければ1.1が使われる</li>
</ul>
<pre><code>calcPrice(1000)        // taxRate省略 → 1.1で計算 → 1100
calcPrice(1000, 1.08)  // 軽減税率 → 1080</code></pre>
<div class="tip">💡 <code>if (title) { ... }</code> は「titleに中身があれば」の意味。undefined・空文字・0 は「なし」扱い（falsy）になります。?付き引数とこのifはセットで頻出します。</div>
`,
    model: `function calcPrice(base: number, taxRate: number = 1.1): number {
  return Math.round(base * taxRate);
}

function greet(name: string, title?: string): string {
  if (title) {
    return title + " " + name + "さん、ようこそ";
  }
  return name + "さん、ようこそ";
}

const line1: string = "税込 " + calcPrice(1000) + "円";
const line2: string = greet("コハク", "師範");

document.getElementById("output")!.textContent = line1 + " / " + line2;`,
    challenge: {
      spec: "JS-02で作ったTOEFL判定を、型付きで進化させてください。<br>・checkScore(score: number, goal: number = 80): string を定義<br>・score が goal 以上なら「目標達成！」、未満なら「あと○点」を返す<br>・checkScore(53) と checkScore(53, 60) の両方の結果を「 / 」でつないでoutputに表示",
      allowed: ["function", ": number", ": string", "デフォルト値 = 80", "if / else", ">=", "return", "+（連結）", "document.getElementById()!"],
      model: `function checkScore(score: number, goal: number = 80): string {
  if (score >= goal) {
    return "目標達成！";
  }
  return "あと" + (goal - score) + "点";
}

const result1: string = checkScore(53);
const result2: string = checkScore(53, 60);

document.getElementById("output")!.textContent = result1 + " / " + result2;`,
      checklist: [
        "引数2つと戻り値、すべてに型を書いた",
        "デフォルト値 = 80 のおかげで checkScore(53) が1引数で呼べた",
        "「あと27点 / あと7点」と表示された",
      ],
    },
  },
  {
    id: "ts-03",
    unit: "ts",
    title: "オブジェクトの型と interface",
    previewMode: "ts",
    scaffold: TS_SCAFFOLD,
    scaffoldNote: TS_NOTE,
    filename: "main.ts",
    explanation: `
<h3>オブジェクト — 関連するデータをまとめる箱</h3>
<p>「名前・年齢・趣味」のように関連する値は、バラバラの変数ではなく<strong>オブジェクト</strong>にまとめます。<code>{ }</code> の中に <code>キー: 値</code> をカンマ区切りで並べ、取り出すときは <code>me.name</code> のように<strong>ドット</strong>でつなぎます。</p>
<pre><code>const me = { name: "コハク", age: 20 };
me.name   // "コハク"</code></pre>

<h3>interface — オブジェクトの「形」の設計図</h3>
<pre><code>interface User {
  name: string;    // nameという文字列を必ず持つ
  age: number;     // ageという数値を必ず持つ
  hobby?: string;  // hobbyは持っていてもいなくてもいい（?）
}</code></pre>
<p><code>interface</code> は「この形のオブジェクトをUserと呼ぶ」という宣言です。一度定義すれば <code>: User</code> と書くだけで、その形を強制できます。</p>

<h3>なぜinterfaceが最重要か</h3>
<p>実務のコードは、ほぼすべてのデータ（ユーザー情報・商品・投稿…）をオブジェクトで受け渡しします。つまり<strong>interfaceが読めれば「このデータに何が入っているか」が仕様書のようにわかる</strong>のです。AIが生成したコードを理解する際、最初に読むべきはinterface定義です。</p>
<div class="tip">💡 命名の慣習: interface名は大文字始まり（User, Book, Task）。これはReact以降でも徹底される、コードを読むうえでの重要な目印です。</div>
`,
    model: `interface User {
  name: string;
  age: number;
  hobby?: string;
}

function introduce(user: User): string {
  if (user.hobby) {
    return user.name + "（" + user.age + "歳）趣味: " + user.hobby;
  }
  return user.name + "（" + user.age + "歳）";
}

const me: User = { name: "コハク", age: 20, hobby: "AI" };
const friend: User = { name: "タロウ", age: 21 };

document.getElementById("output")!.textContent =
  introduce(me) + " / " + introduce(friend);`,
    challenge: {
      spec: "本の情報を扱うプログラムを書いてください。<br>・interface Book を定義: title（string）、price（number）、author は省略可能（string）<br>・describe(book: Book): string を定義。authorがあれば「タイトル（著者）価格円」、なければ「タイトル 価格円」を返す<br>・Book型のオブジェクトを1冊分作り、describe の結果をoutputに表示",
      allowed: ["interface", "?（省略可能）", ": Book", "function", "if", "return", ".（ドットアクセス）", "document.getElementById()!"],
      model: `interface Book {
  title: string;
  price: number;
  author?: string;
}

function describe(book: Book): string {
  if (book.author) {
    return book.title + "（" + book.author + "）" + book.price + "円";
  }
  return book.title + " " + book.price + "円";
}

const myBook: Book = { title: "TS入門", price: 2800, author: "コハク" };

document.getElementById("output")!.textContent = describe(myBook);`,
      checklist: [
        "interfaceで3つのプロパティ（うち1つは?付き）を定義した",
        "関数の引数に : Book と書いて形を強制した",
        "book.title のようにドットで値を取り出せた",
      ],
    },
  },
  {
    id: "ts-04",
    unit: "ts",
    title: "配列・アロー関数・ユニオン型 —「AIのコード」が読める文法へ",
    previewMode: "ts",
    scaffold: TS_SCAFFOLD,
    scaffoldNote: TS_NOTE,
    filename: "main.ts",
    explanation: `
<h3>配列の型と、配列を加工するメソッド</h3>
<pre><code>const scores: number[] = [72, 85, 91, 68];  // 数値の配列</code></pre>
<ul>
  <li><code>.filter(条件)</code> — 条件に合う要素だけ残した<strong>新しい配列</strong>を返す</li>
  <li><code>.map(変換)</code> — 全要素を変換した<strong>新しい配列</strong>を返す（React編で主役になる）</li>
  <li><code>.join("、")</code> — 配列を区切り文字でつないで1つの文字列にする</li>
</ul>

<h3>アロー関数 — AIコードの9割はこの書き方</h3>
<p><code>function</code> の現代的な省略形です。<strong>これが読めないとAIのコードは読めません</strong>。</p>
<pre><code>// 従来の書き方
scores.filter(function (s: number): boolean { return s >= 80; });
// アロー関数（同じ意味）
scores.filter((s: number) => s >= 80);</code></pre>
<p>読み方: 「sを受け取って（=>）s >= 80 を返す」。<code>=&gt;</code> の右が式1つだけなら、<code>{ }</code> と <code>return</code> を省略できます（暗黙のreturn）。</p>

<h3>ユニオン型とリテラル型 —「どれか」を型にする</h3>
<pre><code>type Size = "small" | "medium" | "large";  // この3つの文字列しか許さない
function price(size: Size): number { ... }
price("medium")  // OK
price("big")     // 型エラー！（実行前に間違いがわかる）</code></pre>
<p><code>type</code> はinterfaceの仲間で、型に名前をつける文です。<code>|</code> は「または」。この形はAIが生成するコードの設定値・状態管理に非常によく登場します。</p>
<div class="tip">💡 <strong>読めるようになるべきもう1つの書き方:</strong> テンプレートリテラル。<code>\`合計は&#36;{total}円\`</code> のようにバッククォートで囲むと、&#36;{ } の中に変数を埋め込めます。+ での連結と同じ意味です。AIはほぼ必ずこちらを使うので、見たら「+連結の別の書き方だ」と訳してください。</div>
`,
    model: `const scores: number[] = [72, 85, 91, 68];

const passed: number[] = scores.filter((s: number) => s >= 80);

type Size = "small" | "medium" | "large";

const menu = { small: 300, medium: 400, large: 500 };

function price(size: Size): number {
  return menu[size];
}

const text: string =
  "合格: " + passed.join("点, ") + "点 / Mサイズは" + price("medium") + "円";

document.getElementById("output")!.textContent = text;`,
    challenge: {
      spec: "学習時間の集計プログラムを書いてください。<br>・hours: number[] = [2, 1, 4, 4, 3] を宣言（今週の勉強時間）<br>・アロー関数を使ったfilterで「3時間以上の日」だけ残す<br>・type Plan = \"free\" | \"pro\" と、Planを受け取って月額（free=0、pro=980）を返す関数を定義<br>・「集中日: 4, 4, 3 / proは980円」の形でoutputに表示（joinを使う）",
      allowed: ["number[]", ".filter()", "アロー関数 =>", ".join()", "type A = \"x\" | \"y\"", "function", "document.getElementById()!"],
      model: `const hours: number[] = [2, 1, 4, 4, 3];

const focused: number[] = hours.filter((h: number) => h >= 3);

type Plan = "free" | "pro";

function monthlyFee(plan: Plan): number {
  if (plan === "free") {
    return 0;
  }
  return 980;
}

document.getElementById("output")!.textContent =
  "集中日: " + focused.join(", ") + " / proは" + monthlyFee("pro") + "円";`,
      checklist: [
        "filterの中をアロー関数 (h) => h >= 3 で書けた",
        "type と | で「2択しか許さない型」を作った",
        "filterは元の配列を変えず「新しい配列」を返すと説明できる",
      ],
    },
  },

  // ================= React =================
  {
    id: "react-01",
    unit: "react",
    title: "コンポーネントとJSX — UIを「部品」で作る",
    previewMode: "react",
    scaffoldNote: REACT_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>Reactの発想 — 画面を「部品（コンポーネント）」の組み合わせで作る</h3>
<p>ここまでは1枚のHTMLに全部書いてきました。しかし実際のアプリは、ヘッダー・カード・ボタン…同じ見た目が何十回も登場します。Reactは<strong>UIを再利用可能な部品として定義し、組み合わせる</strong>ためのライブラリです。世界で最も使われているUI技術であり、AIが生成するフロントエンドコードの大半はReactです。</p>
<p><strong>コンポーネント＝「HTMLのようなものを返す関数」</strong>。これだけです。</p>
<pre><code>function Title() {
  return &lt;h1&gt;こんにちは&lt;/h1&gt;;
}
// 使うときはタグのように書く: &lt;Title /&gt;</code></pre>

<h3>JSX — JSの中にHTMLを書ける記法</h3>
<p>関数の中に書いたHTMLらしきものは<strong>JSX</strong>と呼ばれ、実はJSに変換されて動きます。見た目はHTML、正体はJS。だからルールが少し違います:</p>
<ul>
  <li><strong>コンポーネント名は大文字始まり</strong>（Title ○ / title ×。小文字は普通のHTMLタグと解釈される）</li>
  <li><strong>返すのは1つの親要素</strong>。複数並べるなら &lt;div&gt; か空タグ &lt;&gt;...&lt;/&gt; で包む</li>
  <li><code>class</code> ではなく <code>className</code>（classはJSの予約語なので）</li>
  <li><code>{ }</code> の中にはJSの式が書ける — 変数の埋め込み・計算・関数呼び出し</li>
</ul>
<pre><code>const name = "コハク";
return &lt;p&gt;ようこそ、{name}さん！ 3年後は{20 + 3}歳&lt;/p&gt;;</code></pre>
<div class="tip">💡 ファイル拡張子は <code>.tsx</code>（TypeScript + JSX）。<code>export default App;</code> は「このファイルの代表としてAppを外に公開する」という宣言で、Reactプロジェクトの全ファイルに登場する定型文です。</div>
`,
    model: `function Title() {
  return <h1>Code Dojo React編</h1>;
}

function App() {
  const userName: string = "コハク";
  return (
    <div>
      <Title />
      <p>ようこそ、{userName}さん！</p>
      <p>計算も埋め込める: {10 + 5}</p>
    </div>
  );
}

export default App;`,
    challenge: {
      spec: "自己紹介アプリを作ってください。<br>・Header コンポーネント: h1で「マイページ」を返す<br>・App コンポーネント: constで自分の名前を宣言し、&lt;Header /&gt; と、{ }で名前を埋め込んだ段落を返す<br>・全体を1つのdivで包み、最後に export default App; を書く",
      allowed: ["function 大文字名() {}", "return ( JSX )", "<div>で包む", "{変数}", "const", "<Header />", "export default"],
      model: `function Header() {
  return <h1>マイページ</h1>;
}

function App() {
  const myName: string = "コハク";
  return (
    <div>
      <Header />
      <p>{myName}のページへようこそ！</p>
    </div>
  );
}

export default App;`,
      checklist: [
        "コンポーネント名を大文字で始めた",
        "returnの中身が1つの親要素（div）で包まれている",
        "{ }で変数をJSXに埋め込めた",
      ],
    },
  },
  {
    id: "react-02",
    unit: "react",
    title: "props — 部品に情報を渡す",
    previewMode: "react",
    scaffoldNote: REACT_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>propsは「関数の引数」のコンポーネント版</h3>
<p>同じカードを内容だけ変えて3枚出したい——そこで<strong>props</strong>（プロパティ）です。親はHTML属性のような書き方で値を渡し、子は引数として受け取ります。</p>
<pre><code>// 親: 属性のように渡す
&lt;Card title="AI" emoji="🤖" /&gt;

// 子: 分割代入で受け取る
function Card({ title, emoji }: CardProps) { ... }</code></pre>
<p><code>{ title, emoji }</code> は<strong>分割代入</strong>——「オブジェクトから同名の中身を取り出す」記法です。そして受け取るpropsの形は、<strong>TS-03で学んだinterfaceで定義</strong>します。TypeScriptの学びがここで直結します。</p>
<pre><code>interface CardProps {
  title: string;
  emoji: string;
}</code></pre>

<h3>大原則: propsは親→子への一方通行・読み取り専用</h3>
<p>子がpropsを書き換えることはできません。データは上から下に流れる——これがReactの設計思想で、「どこで値が変わったか」を追いやすくしています。AIのコードでデータの流れを追うときは、<strong>propsを上から下へたどる</strong>のが基本です。</p>

<h3>style={{ ... }} の二重カッコの正体</h3>
<pre><code>&lt;div style={{ border: "1px solid #ccc", padding: "8px" }}&gt;</code></pre>
<p>外側の <code>{ }</code> は「JSXにJSの式を埋め込む」記号、内側の <code>{ }</code> は「スタイルのオブジェクト」。CSSと違いプロパティ名はキャメルケース（background-color → backgroundColor）で、値は文字列にします。AIコード超頻出の形です。</p>
`,
    model: `interface CardProps {
  title: string;
  emoji: string;
}

function Card({ title, emoji }: CardProps) {
  return (
    <div style={{ border: "1px solid #94a3b8", borderRadius: "8px", padding: "8px", margin: "6px" }}>
      <strong>{emoji} {title}</strong>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>今日の学習メニュー</h1>
      <Card title="AI" emoji="🤖" />
      <Card title="英語" emoji="📘" />
      <Card title="プログラミング" emoji="💻" />
    </div>
  );
}

export default App;`,
    challenge: {
      spec: "学習時間カードを作ってください。<br>・interface SubjectProps を定義: name（string）と hours（number）<br>・SubjectCard コンポーネント: propsを分割代入で受け取り、「AI: 週6時間」の形の段落を返す<br>・Appから &lt;SubjectCard name=\"AI\" hours={6} /&gt; のように3枚、違う値で表示<br>※ 数値を渡すときは hours={6} と{ }で渡す点に注意",
      allowed: ["interface", "function Card({ a, b }: Props)", "{props値}", "<SubjectCard name=... hours={数値} />", "export default"],
      model: `interface SubjectProps {
  name: string;
  hours: number;
}

function SubjectCard({ name, hours }: SubjectProps) {
  return (
    <p>
      {name}: 週{hours}時間
    </p>
  );
}

function App() {
  return (
    <div>
      <h1>今週の学習計画</h1>
      <SubjectCard name="AI" hours={6} />
      <SubjectCard name="英語" hours={5} />
      <SubjectCard name="プログラミング" hours={8} />
    </div>
  );
}

export default App;`,
      checklist: [
        "propsの形をinterfaceで定義した",
        "文字列は name=\"AI\"、数値は hours={6} と渡し分けた",
        "同じコンポーネントを3回、違う中身で再利用できた",
      ],
    },
  },
  {
    id: "react-03",
    unit: "react",
    title: "useState — 画面が「動く」仕組みの心臓部",
    previewMode: "react",
    scaffoldNote: REACT_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>state（状態）— コンポーネントが覚えている値</h3>
<p>JS-03ではカウンターを「変数を増やして、textContentを<strong>手動で</strong>書き換え」て作りました。Reactでは発想が逆転します。<strong>「値が変わったら、画面はReactが自動で描き直す」</strong>。この覚えている値をstateと呼び、useStateで作ります。</p>
<pre><code>const [count, setCount] = useState&lt;number&gt;(0);
//     ↑今の値  ↑変更専用の関数            ↑初期値</code></pre>
<p>読み解き: <code>[count, setCount]</code> は配列の分割代入（2つセットで受け取る）。<code>&lt;number&gt;</code> はTS-04で見たジェネリクス——「このstateはnumber型」という指定です。</p>

<h3>なぜ普通の変数ではダメなのか（最重要）</h3>
<p>Reactは「<strong>set関数が呼ばれたら、そのコンポーネント関数をもう一度実行して画面を作り直す</strong>」（再レンダリング）という仕組みで動きます。普通の変数への代入（count = 1）ではReactが変化に気づけず、画面は更新されません。<strong>stateの変更は必ずset関数で</strong>——Reactの鉄則第1条です。</p>

<h3>イベントとの接続</h3>
<pre><code>&lt;button onClick={() =&gt; setCount(count + 1)}&gt;+1&lt;/button&gt;</code></pre>
<p>JS-03のaddEventListenerに相当するのが <code>onClick={アロー関数}</code>。「クリックされたらsetCountを呼ぶ」だけで、あとの画面更新はReactが全部やってくれます。textContentの手動書き換えが消えたことに注目してください。</p>
<div class="tip">💡 JS-03のカウンターと今回のカウンターは<strong>まったく同じアプリ</strong>です。書き比べると「Reactが何を肩代わりしてくれるのか」が腹落ちします。②を打ち終えたら、ぜひJS-03の手本と見比べてください。</div>
`,
    model: `import { useState } from "react";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>クリックカウンター React版</h1>
      <p>{count}回</p>
      <button onClick={() => setCount(count + 1)}>クリック！</button>
    </div>
  );
}

export default App;`,
    challenge: {
      spec: "JS-03の挑戦課題「やる気メーター」をReactで作り直してください。<br>・useState&lt;number&gt;(0) でstateを作る<br>・「やる気+10」ボタンを押すたびに10増える<br>・「0%」「10%」…と%付きで表示する<br>・importから書き始めること",
      allowed: ["import { useState } from \"react\"", "useState<number>(0)", "onClick={() => set関数(...)}", "{state}", "JSX", "export default"],
      model: `import { useState } from "react";

function App() {
  const [power, setPower] = useState<number>(0);

  return (
    <div>
      <h1>今日のやる気メーター</h1>
      <p>{power}%</p>
      <button onClick={() => setPower(power + 10)}>やる気+10</button>
    </div>
  );
}

export default App;`,
      checklist: [
        "useStateの分解（[値, set関数] = useState<型>(初期値)）を説明できる",
        "値の変更をset関数だけで行った（power = ... と書いていない）",
        "JS-03版と比べて「手動の画面書き換えが消えた」ことを確認した",
      ],
    },
  },
  {
    id: "react-04",
    unit: "react",
    title: "リスト表示とkey — 配列を画面に変換する",
    previewMode: "react",
    scaffoldNote: REACT_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>配列 → JSXの列への変換は .map</h3>
<p>タスク一覧・商品一覧・チャット履歴…アプリの画面の大半は「配列を並べたもの」です。Reactでは、TS-04で学んだ <code>.map</code> で<strong>データの配列をJSX要素の配列に変換</strong>して埋め込みます。</p>
<pre><code>&lt;ul&gt;
  {tasks.map((task) =&gt; (
    &lt;li key={task.id}&gt;{task.name}&lt;/li&gt;
  ))}
&lt;/ul&gt;</code></pre>
<p>この形はAIが生成するReactコードに<strong>ほぼ100%登場</strong>します。「配列.map(1件 => その1件のJSX)」と訳せるようにしてください。</p>

<h3>key — Reactが列を見分けるための名札</h3>
<p>mapで並べる要素には <code>key={一意な値}</code> が必須です。Reactは再レンダリングのとき、keyを頼りに「どの行が追加/削除/移動されたか」を特定して、<strong>変わった行だけ</strong>を効率よく描き直します。keyがないと console に警告が出ます——AIコードのデバッグで最も多い警告の1つです。</p>

<h3>三項演算子 — JSXの中のif</h3>
<pre><code>{task.done ? "✅" : "⬜"}
// 「task.doneが真なら✅、偽なら⬜」</code></pre>
<p>JSXの<code>{ }</code>の中には「式」しか書けず、if文は書けません。代わりに使うのが<strong>三項演算子（条件 ? 真のとき : 偽のとき）</strong>。これもAIコード最頻出の書き方です。</p>
<div class="tip">💡 データの形はTS-03のinterfaceで定義しています。「interfaceでデータの形を決める → 配列を作る → mapで画面に変換」。この3段構えが、あらゆる一覧画面の作り方です。</div>
`,
    model: `interface Task {
  id: number;
  name: string;
  done: boolean;
}

function App() {
  const tasks: Task[] = [
    { id: 1, name: "タイピング練習", done: true },
    { id: 2, name: "TOEFL単語", done: false },
    { id: 3, name: "React学習", done: false },
  ];

  return (
    <div>
      <h1>今日のタスク</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.done ? "✅" : "⬜"} {task.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
    challenge: {
      spec: "科目一覧アプリを作ってください。<br>・interface Subject: id（number）、name（string）、hours（number）<br>・Subject[] 型の配列に3科目分のデータを入れる<br>・mapで「AI — 週6時間」の形のliに変換して表示（key={subject.id} を忘れずに）",
      allowed: ["interface", "型[] の配列", "{配列.map((s) => ( JSX ))}", "key={一意な値}", "<ul> <li>", "export default"],
      model: `interface Subject {
  id: number;
  name: string;
  hours: number;
}

function App() {
  const subjects: Subject[] = [
    { id: 1, name: "AI", hours: 6 },
    { id: 2, name: "英語", hours: 5 },
    { id: 3, name: "プログラミング", hours: 8 },
  ];

  return (
    <div>
      <h1>学習科目</h1>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {subject.name} — 週{subject.hours}時間
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
      checklist: [
        "interface → 配列 → map の3段構えで書けた",
        "liに key={subject.id} を付けた（なぜ必要かも説明できる）",
        "mapの中のアロー関数が「1件分のデータ → 1件分のJSX」の変換になっている",
      ],
    },
  },
  {
    id: "react-05",
    unit: "react",
    title: "フォーム入力と配列のstate — ミニToDoで総仕上げ",
    previewMode: "react",
    scaffoldNote: REACT_NOTE,
    filename: "App.tsx",
    explanation: `
<h3>制御コンポーネント — 入力欄の中身もstateで管理</h3>
<pre><code>&lt;input value={text} onChange={(e) =&gt; setText(e.target.value)} /&gt;</code></pre>
<p>React流のフォームは「入力欄の見た目（value）はstateが決め、キー入力（onChange）のたびにstateを更新する」という循環で動きます。<code>e.target.value</code> は「イベントが起きた要素（e.target）の現在の入力値」。この1行は<strong>丸ごと頻出パターン</strong>として覚えてOKです。</p>

<h3>配列のstateには追加しない、「新しい配列」を作る</h3>
<pre><code>setItems([...items, text]);  // ○ コピー+追加した新配列を渡す
items.push(text);            // × 直接いじるのはNG</code></pre>
<p><code>[...items, text]</code> は<strong>スプレッド構文</strong>——「itemsの中身を展開して並べ、最後にtextを足した新しい配列」です。Reactは「前の配列と別物になったか」で変化を検知するため、<strong>pushで中身だけ変えても画面が更新されません</strong>。「stateは直接いじらず、新しい値を作ってsetする」——鉄則第2条です。AIコードのバグ調査でも頻出のポイント。</p>

<h3>この1画面に全部入っている</h3>
<p>useState2つ（入力中の文字列＋配列）、制御コンポーネント、追加関数、map+key。<strong>これがあらゆるWebアプリのDNA</strong>です。ToDo・チャット・メモ・カート、全部この構造の変形にすぎません。</p>
<div class="tip">💡 <code>if (text === "") return;</code> は「空なら何もせず関数を抜ける」早期リターン。ガード節と呼ばれ、読みやすいコードの定番技です。今回のkey={index}は手抜き版——本来はTS-04までのようにidを持たせるのが正道ですが、削除や並べ替えがないアプリでは許容されます。</div>
`,
    model: `import { useState } from "react";

function App() {
  const [text, setText] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (text === "") return;
    setItems([...items, text]);
    setText("");
  };

  return (
    <div>
      <h1>ミニToDo</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addItem}>追加</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
    challenge: {
      spec: "「今日の一言メモ」アプリを作ってください。<br>・入力欄＋「追加」ボタン。追加したら入力欄は空に戻す<br>・空文字のときは追加しない（ガード節）<br>・&lt;p&gt;{items.length}件&lt;/p&gt; で件数を表示<br>・メモ一覧をmapで表示（key付き）",
      allowed: ["useState<string>(\"\")", "useState<string[]>([])", "value= / onChange=", "e.target.value", "[...配列, 追加分]", "if (...) return;", ".length", ".map + key"],
      model: `import { useState } from "react";

function App() {
  const [text, setText] = useState<string>("");
  const [memos, setMemos] = useState<string[]>([]);

  const addMemo = () => {
    if (text === "") return;
    setMemos([...memos, text]);
    setText("");
  };

  return (
    <div>
      <h1>今日の一言メモ</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addMemo}>追加</button>
      <p>{memos.length}件</p>
      <ul>
        {memos.map((memo, index) => (
          <li key={index}>{memo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
      checklist: [
        "value と onChange の循環（制御コンポーネント）を説明できる",
        "追加を [...memos, text] で行い、pushを使っていない",
        "プレビューで実際に入力→追加し、件数と一覧が更新された",
      ],
    },
  }
);
